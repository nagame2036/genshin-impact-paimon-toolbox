import {Injectable} from '@angular/core';
import {I18n} from '../../widget/models/i18n.model';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {weaponTypeList} from '../models/weapon-type.enum';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {first, map, mergeMap, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {ItemType} from '../../game-common/models/item-type.enum';
import {StatsType} from '../../game-common/models/stats.model';
import {RequirementDetail} from '../../material/models/requirement-detail.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private readonly i18n = new I18n('weapons');

  private readonly weapons$ = new ReplaySubject<Map<number, Weapon>>(1);

  readonly weapons = this.weapons$.asObservable();

  readonly infos = this.information.infos.pipe(map(infos => [...infos.values()]));

  readonly sorts: { text: string, value: (a: WeaponOverview, b: WeaponOverview) => number }[] = [
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
    zip(this.information.infos, this.progressor.inProgress, this.planner.plans)
      .pipe(
        first(),
        map(([infos, inProgress, plans]) => {
          const weapons = new Map<number, Weapon>();
          for (const [id, progress] of inProgress) {
            const [info, plan] = [infos.get(progress.weaponId), plans.get(id)];
            if (info && plan) {
              weapons.set(id, {info, progress, plan});
            }
          }
          this.logger.info('loaded weapons', weapons);
          this.weapons$.next(weapons);
          return weapons;
        }),
        switchMap(weapons => {
          const requirementObs = [...weapons.values()].map(weapon => {
            return this.planner.getRequirement(weapon)
              .pipe(switchMap(req => this.materials.updateRequirement(ItemType.WEAPON, weapon.progress.id, req)));
          });
          return forkJoin(requirementObs);
        })
      )
      .subscribe(_ => this.logger.info('loaded the requirements of all weapons'));
  }

  create(info: WeaponInfo): Observable<WeaponOverview> {
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

  getRequirementDetails(weapon: Weapon): Observable<RequirementDetail[]> {
    return this.planner.getRequirementDetails(weapon);
  }

  getOverview(weapon: Weapon): Observable<WeaponOverview> {
    return this.information.getStats(weapon);
  }

  getStatsTypes(weapon: WeaponOverview): StatsType[] {
    const stats = weapon.currentStats;
    return stats.getTypes();
  }

  getAll(): Observable<WeaponOverview[]> {
    return this.weapons.pipe(
      switchMap(weapons => {
        if (weapons.size === 0) {
          return of([]);
        }
        const statsObs: Observable<WeaponOverview>[] = [];
        for (const weapon of weapons.values()) {
          statsObs.push(this.getOverview(weapon));
        }
        return forkJoin(statsObs);
      }),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  view(weapons: WeaponOverview[]): WeaponOverview[] {
    return weapons.filter(c => this.filterInfo(c.info)).sort((a, b) => this.sort(a, b) || b.info.id - a.info.id);
  }

  viewInfos(weapons: WeaponInfo[]): WeaponInfo[] {
    return weapons.filter(c => this.filterInfo(c)).sort((a, b) => this.infoSort(a, b) || b.id - a.id);
  }

  update(weapon: Weapon): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weapons.set(weapon.progress.id, weapon);
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.update(weapon)),
        mergeMap(_ => this.planner.update(weapon)),
        mergeMap(_ => this.planner.getRequirement(weapon)),
        mergeMap(req => this.materials.updateRequirement(ItemType.WEAPON, weapon.progress.id, req)),
      )
      .subscribe(_ => this.logger.info('updated weapon', weapon));
  }

  remove(weapon: Weapon): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weapons.delete(weapon.progress.id);
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.remove(weapon)),
        mergeMap(_ => this.planner.remove(weapon)),
        mergeMap(_ => this.materials.removeRequirement(ItemType.WEAPON, weapon.progress.id)),
      )
      .subscribe(_ => this.logger.info('removed weapon', weapon));
  }

  removeAll(weaponList: Weapon[]): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weaponList.forEach(weapon => weapons.delete(weapon.progress.id));
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.removeAll(weaponList)),
        mergeMap(_ => this.planner.removeAll(weaponList)),
        mergeMap(_ => this.materials.removeAllRequirement(ItemType.WEAPON, weaponList.map(it => it.progress.id))),
      )
      .subscribe(_ => this.logger.info('removed weapons', weaponList));
  }

  private filterInfo({rarity, type}: WeaponInfo): boolean {
    return this.rarityFilter.includes(rarity) && this.typeFilter.includes(type);
  }

  private generateSorts(types: StatsType[]): { text: string, value: (a: WeaponOverview, b: WeaponOverview) => number }[] {
    return types.map(type => {
      return {text: this.i18n.stats(type), value: ({currentStats: a}, {currentStats: b}) => b.get(type) - a.get(type)};
    });
  }
}
