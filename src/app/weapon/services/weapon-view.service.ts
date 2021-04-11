import {Injectable} from '@angular/core';
import {WeaponOverview} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {allWeaponTypes, WeaponType} from '../models/weapon-type.enum';
import {I18n} from '../../widget/models/i18n.model';
import {StatsType} from '../../game-common/models/stats.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponViewOptions} from '../models/weapon-options.model';
import {SettingService} from '../../setting/services/setting.service';
import {ItemSort, ItemViewService} from '../../game-common/services/item-view.service';

const i18n = I18n.create('weapons');

const sortMap = new Map<string, ItemSort<WeaponOverview>>([
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

const infoSortMap = new Map<string, ItemSort<WeaponInfo>>([
  [i18n.dict('rarity'), (a, b) => b.rarity - a.rarity],
]);

@Injectable({
  providedIn: 'root',
})
export class WeaponViewService extends ItemViewService<
  WeaponOverview,
  WeaponViewOptions
> {
  readonly rarities = allWeaponRarities.map(it => ({value: it, text: `★${it}`}));

  readonly types = allWeaponTypes.map(it => ({
    value: it,
    text: i18n.data(`weapon-type.${it}`),
  }));

  constructor(settings: SettingService) {
    super(sortMap, infoSortMap, settings, 'weapon-view', {
      rarities: allWeaponRarities,
      types: allWeaponTypes,
    });
  }

  filterRarity(rarities: Rarity[]): void {
    this.updateView({rarities});
  }

  filterType(types: WeaponType[]): void {
    this.updateView({types});
  }

  protected filterInfo(
    {rarity, type}: WeaponInfo,
    {rarities, types}: WeaponViewOptions,
  ): boolean {
    return rarities.includes(rarity) && types.includes(type);
  }
}

function generateSorts(types: StatsType[]): [string, ItemSort<WeaponOverview>][] {
  return types.map(type => [
    i18n.stats(type),
    (a, b) => b.currentStats.get(type) - a.currentStats.get(type),
  ]);
}
