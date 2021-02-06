import {Injectable} from '@angular/core';
import {I18n} from '../../widget/models/i18n.model';
import {combineLatest, EMPTY, forkJoin, Observable, of, ReplaySubject} from 'rxjs';
import {Weapon} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {weaponTypeList} from '../models/weapon-type.enum';
import {WeaponInfoService, WeaponStatsDependency} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {map, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {MaterialList} from '../../material/models/material-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {WeaponPlan} from '../models/weapon-plan.model';
import {WeaponProgress} from '../models/weapon-progress.model';
import {WeaponStatsType, WeaponStatsValue} from '../models/weapon-stats.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private readonly i18n = new I18n('weapons');

  private synced = false;

  private readonly weapons$ = new ReplaySubject<Map<number, Weapon>>(1);

  readonly weapons = this.weapons$.asObservable();

  readonly nonParty = this.progressor.noProgress.pipe(map(infos => [...infos.values()]));

  readonly sorts: { text: string, value: (a: Weapon, b: Weapon) => number }[] = [
    {text: this.i18n.dict('level'), value: (a, b) => b.progress.level - a.progress.level},
    {text: this.i18n.dict('rarity'), value: (a, b) => b.info.rarity - a.info.rarity},
    {text: this.i18n.dict('refine-rank'), value: (a, b) => b.progress.refine - a.progress.refine},
  ];

  sort = this.sorts[0].value;

  readonly infoSorts: { text: string, value: (a: WeaponInfo, b: WeaponInfo) => number }[] = [
    {text: this.i18n.dict('rarity'), value: (a, b) => b.rarity - a.rarity},
  ];

  infoSort = this.infoSorts[0].value;

  readonly rarities = allWeaponRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = allWeaponRarities;

  readonly types = weaponTypeList.map(it => ({value: it, text: this.i18n.dict(`weapon-types.${it}`)}));

  typeFilter = weaponTypeList;

  constructor(private information: WeaponInfoService, private progressor: WeaponProgressService,
              private planner: WeaponPlanner, private materials: MaterialService, private logger: NGXLogger) {
    this.sync();
  }

  sync(): void {
    if (this.synced) {
      return;
    }
    this.synced = true;
    combineLatest([this.information.items, this.progressor.inProgress, this.planner.plans])
      .subscribe(([infos, inProgress, plans]) => {
        this.syncWeapons(infos, inProgress, plans);
        this.syncTotalRequirements();
      });
  }

  create(info: WeaponInfo): Weapon {
    const id = new Date().getTime();
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    return {info, progress, plan};
  }

  get(id: number): Observable<Weapon> {
    return this.weapons.pipe(
      switchMap(weapons => {
        const weapon = weapons.get(id);
        return weapon ? of(weapon) : EMPTY;
      }),
      throwIfEmpty(),
      tap(weapon => this.logger.info('sent weapon', weapon)),
    );
  }

  getStats({info, progress, plan}: Weapon): Observable<[WeaponStatsValue, WeaponStatsValue]> {
    return forkJoin([this.getSpecificStats(info, progress), this.getSpecificStats(info, plan)]);
  }

  getSpecificStats(info: WeaponInfo, dependency: WeaponStatsDependency): Observable<WeaponStatsValue> {
    return this.information.getStats(info, dependency);
  }

  getStatsTypes(stats: WeaponStatsValue): WeaponStatsType[] {
    return Object.keys(stats).filter(it => stats.hasOwnProperty(it)) as WeaponStatsType[];
  }

  getAll(): Observable<Weapon[]> {
    return this.weapons.pipe(
      map(weapons => [...weapons.values()]),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  view(weapons: Weapon[]): Weapon[] {
    return weapons.filter(c => this.filterInfo(c.info)).sort((a, b) => this.sort(a, b) || b.info.id - a.info.id);
  }

  viewInfos(weapons: WeaponInfo[]): WeaponInfo[] {
    return weapons.filter(c => this.filterInfo(c)).sort((a, b) => this.infoSort(a, b) || b.id - a.id);
  }

  update(weapon: Weapon): void {
    this.progressor.update(weapon);
    this.planner.update(weapon);
    this.logger.info('updated weapon', weapon);
  }

  remove(weapon: Weapon): void {
    this.progressor.remove(weapon);
    this.planner.remove(weapon);
    this.logger.info('removed weapon', weapon);
  }

  removeAll(weapons: Weapon[]): void {
    this.progressor.removeAll(weapons);
    this.planner.removeAll(weapons);
    this.logger.info('removed weapons', weapons);
  }

  specificRequirement(weapon: Weapon): Observable<{ text: string; value: MaterialList; satisfied: boolean }>[] {
    return this.planner.specificRequirements(weapon);
  }

  private syncWeapons(infos: Map<number, WeaponInfo>, inProgress: Map<number, WeaponProgress>, plans: Map<number, WeaponPlan>): void {
    const weapons = new Map<number, Weapon>();
    for (const [id, progress] of inProgress) {
      const [info, plan] = [infos.get(progress.weaponId), plans.get(id)];
      if (info && plan) {
        weapons.set(id, {info, progress, plan});
      }
    }
    this.logger.info('updated weapons', weapons);
    this.weapons$.next(weapons);
  }

  private syncTotalRequirements(): void {
    this.weapons
      .pipe(switchMap(weapons => this.planner.totalRequirements([...weapons.values()])))
      .subscribe(requirements => this.materials.updateRequirement(ItemType.WEAPON, requirements));
  }

  private filterInfo({rarity, type}: WeaponInfo): boolean {
    return this.rarityFilter.includes(rarity) && this.typeFilter.includes(type);
  }
}
