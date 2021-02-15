import {Injectable} from '@angular/core';
import {I18n} from '../../widget/models/i18n.model';
import {combineLatest, EMPTY, forkJoin, Observable, of, ReplaySubject} from 'rxjs';
import {Weapon, WeaponWithStats} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {weaponTypeList} from '../models/weapon-type.enum';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {map, mergeMap, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {ItemType} from '../../game-common/models/item-type.enum';
import {WeaponPlan} from '../models/weapon-plan.model';
import {WeaponProgress} from '../models/weapon-progress.model';
import {StatsType} from '../../game-common/models/stats.model';
import {RequirementDetail} from '../../material/models/requirement-detail.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private readonly i18n = new I18n('weapons');

  private synced = false;

  private readonly weapons$ = new ReplaySubject<Map<number, Weapon>>(1);

  readonly weapons = this.weapons$.asObservable();

  readonly nonParty = this.progressor.noProgress.pipe(map(infos => [...infos.values()]));

  readonly sorts: { text: string, value: (a: WeaponWithStats, b: WeaponWithStats) => number }[] = [
    {text: this.i18n.dict('level'), value: ({progress: a}, {progress: b}) => b.ascension - a.ascension || b.level - a.level},
    {text: this.i18n.dict('rarity'), value: ({info: a}, {info: b}) => b.rarity - a.rarity},
    {text: this.i18n.dict('refine-rank'), value: ({progress: a}, {progress: b}) => b.refine - a.refine},
    ...this.generateSorts([
      'ATK Base',
      'ATK%',
      'CHC%',
      'CHD%',
      'ER%',
      'PHY DMG%',
      'HP%',
      'EM',
      'DEF%',
    ]),
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
    combineLatest([this.information.items, this.progressor.inProgress, this.planner.plans]).pipe(
      map(([infos, inProgress, plans]) => this.syncWeapons(infos, inProgress, plans)),
      mergeMap(_ => this.syncTotalRequirements())
    )
      .subscribe();
  }

  create(info: WeaponInfo): Observable<WeaponWithStats> {
    const id = new Date().getTime() * 100 + ItemType.WEAPON;
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const weapon = {info, progress, plan};
    return this.information.getStats(weapon);
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

  getStats(weapon: Weapon): Observable<WeaponWithStats> {
    return this.information.getStats(weapon);
  }

  getStatsTypes(weapon: WeaponWithStats): StatsType[] {
    const stats = weapon.currentStats;
    return stats.getTypes();
  }

  getAll(): Observable<WeaponWithStats[]> {
    return this.weapons.pipe(
      switchMap(weapons => {
        if (weapons.size === 0) {
          return of([]);
        }
        const statsObs: Observable<WeaponWithStats>[] = [];
        for (const weapon of weapons.values()) {
          statsObs.push(this.getStats(weapon));
        }
        return forkJoin(statsObs);
      }),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  view(weapons: WeaponWithStats[]): WeaponWithStats[] {
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

  specificRequirement(weapon: Weapon): Observable<RequirementDetail[]> {
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

  private syncTotalRequirements(): Observable<void> {
    return this.weapons.pipe(
      switchMap(weapons => this.planner.totalRequirements([...weapons.values()])),
      map(requirements => this.materials.updateRequirement(ItemType.WEAPON, requirements)),
    );
  }

  private filterInfo({rarity, type}: WeaponInfo): boolean {
    return this.rarityFilter.includes(rarity) && this.typeFilter.includes(type);
  }

  private generateSorts(types: StatsType[]): { text: string, value: (a: WeaponWithStats, b: WeaponWithStats) => number }[] {
    return types.map(type => {
      return {text: this.i18n.stats(type), value: ({currentStats: a}, {currentStats: b}) => b.get(type) - a.get(type)};
    });
  }
}
