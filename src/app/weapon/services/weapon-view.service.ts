import {Injectable} from '@angular/core';
import {WeaponOverview} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {allWeaponTypes, WeaponType} from '../models/weapon-type.enum';
import {I18n} from '../../widget/models/i18n.model';
import {StatsType} from '../../game-common/models/stats.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {Observable, ReplaySubject} from 'rxjs';
import {WeaponViewOptions} from '../models/options.model';
import {SettingService} from '../../setting/services/setting.service';
import {map} from 'rxjs/operators';
import {sortItems} from '../../shared/utils/collections';

const i18n = I18n.create('weapons');

type WeaponSort = (a: WeaponOverview, b: WeaponOverview) => number;

const sortMap = new Map<string, WeaponSort>([
  [
    i18n.dict('level'),
    ({progress: a}, {progress: b}) => b.ascension - a.ascension || b.level - a.level,
  ],
  [i18n.dict('rarity'), ({info: a}, {info: b}) => b.rarity - a.rarity],
  [i18n.dict('refine-rank'), ({progress: a}, {progress: b}) => b.refine - a.refine],
  ...generateSorts([
    'ATK Base',
    'CHC%',
    'CHD%',
    'ATK%',
    'ER%',
    'HP%',
    'DEF%',
    'Physical DMG%',
    'EM',
  ]),
]);

type WeaponInfoSort = (a: WeaponInfo, b: WeaponInfo) => number;

const infoSortMap = new Map<string, WeaponInfoSort>([
  [i18n.dict('rarity'), (a, b) => b.rarity - a.rarity],
]);

@Injectable({
  providedIn: 'root',
})
export class WeaponViewService {
  private readonly settingKey = 'weapon-view';

  readonly sorts = [...sortMap].map(([text]) => ({text, value: text}));

  readonly infoSorts = [...infoSortMap].map(([text]) => ({text, value: text}));

  readonly rarities = allWeaponRarities.map(it => ({value: it, text: `★${it}`}));

  readonly types = allWeaponTypes.map(it => ({
    value: it,
    text: i18n.dict(`weapon-types.${it}`),
  }));

  private options$ = new ReplaySubject<WeaponViewOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(private settings: SettingService) {
    settings
      .get(this.settingKey, {
        sort: [this.sorts[0].text],
        infoSort: [this.infoSorts[0].text],
        rarities: allWeaponRarities,
        types: allWeaponTypes,
      })
      .subscribe(options => this.options$.next(options));
  }

  view(weapons: WeaponOverview[]): Observable<WeaponOverview[]> {
    return this.options.pipe(
      map(options => {
        const sorts = options.sort.map(it => sortMap.get(it) ?? (() => 0));
        const filtered = weapons.filter(it => filterInfo(it.info, options));
        return sortItems(filtered, [...sorts, (a, b) => b.info.id - a.info.id]);
      }),
    );
  }

  viewInfos(weapons: WeaponInfo[]): Observable<WeaponInfo[]> {
    return this.options.pipe(
      map(options => {
        const option = options.infoSort;
        const sorts = option.map(it => infoSortMap.get(it) ?? (() => 0));
        const filtered = weapons.filter(it => filterInfo(it, options));
        return sortItems(filtered, [...sorts, (a, b) => b.id - a.id]);
      }),
    );
  }

  changeSort(sort: string[]): void {
    this.updateView({sort});
  }

  changeInfoSort(infoSort: string[]): void {
    this.updateView({infoSort});
  }

  filterRarity(rarities: Rarity[]): void {
    this.updateView({rarities});
  }

  filterType(types: WeaponType[]): void {
    this.updateView({types});
  }

  private updateView(update: Partial<WeaponViewOptions>): void {
    this.settings.update(this.settingKey, update);
  }
}

function filterInfo(
  {rarity, type}: WeaponInfo,
  {rarities, types}: WeaponViewOptions,
): boolean {
  return rarities.includes(rarity) && types.includes(type);
}

function generateSorts(types: StatsType[]): [string, WeaponSort][] {
  return types.map(type => [
    i18n.stats(type),
    (a, b) => b.currentStats.get(type) - a.currentStats.get(type),
  ]);
}
