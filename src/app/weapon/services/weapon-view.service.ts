import {Injectable} from '@angular/core';
import {WeaponOverview} from '../models/weapon.model';
import {allWeaponRarities, WeaponInfo} from '../models/weapon-info.model';
import {allWeaponTypes, WeaponType} from '../models/weapon-type.enum';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {StatsType} from '../../game-common/models/stats.model';
import {Rarity} from '../../game-common/models/rarity.type';

type WeaponSort = (a: WeaponOverview, b: WeaponOverview) => number;

type WeaponSortOption = {
  text: string;
  value: WeaponSort;
};

type WeaponInfoSort = (a: WeaponInfo, b: WeaponInfo) => number;

type WeaponInfoSortOption = {
  text: string;
  value: WeaponInfoSort;
};

@Injectable({
  providedIn: 'root',
})
export class WeaponViewService {
  private readonly i18n = new I18n('weapons');

  readonly sorts: WeaponSortOption[] = [
    {
      text: this.i18n.dict('level'),
      value: ({progress: a}, {progress: b}) =>
        b.ascension - a.ascension || b.level - a.level,
    },
    {
      text: this.i18n.dict('rarity'),
      value: ({info: a}, {info: b}) => b.rarity - a.rarity,
    },
    {
      text: this.i18n.dict('refine-rank'),
      value: ({progress: a}, {progress: b}) => b.refine - a.refine,
    },
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

  sort = [this.sorts[0].value];

  readonly infoSorts: WeaponInfoSortOption[] = [
    {
      text: this.i18n.dict('rarity'),
      value: (a, b) => b.rarity - a.rarity,
    },
  ];

  infoSort = [this.infoSorts[0].value];

  readonly rarities = allWeaponRarities.map(it => ({
    value: it,
    text: `★${it}`,
  }));

  rarityFilter = allWeaponRarities;

  readonly types = allWeaponTypes.map(it => ({
    value: it,
    text: this.i18n.dict(`weapon-types.${it}`),
  }));

  typeFilter = allWeaponTypes;

  constructor(private logger: NGXLogger) {}

  view(weapons: WeaponOverview[]): WeaponOverview[] {
    return weapons
      .filter(c => this.filterInfo(c.info))
      .sort(
        (a, b) =>
          this.sort.reduce((acc, curr) => acc || curr(a, b), 0) ||
          b.info.id - a.info.id,
      );
  }

  viewInfos(weapons: WeaponInfo[]): WeaponInfo[] {
    return weapons
      .filter(c => this.filterInfo(c))
      .sort(
        (a, b) =>
          this.infoSort.reduce((acc, curr) => acc || curr(a, b), 0) ||
          b.id - a.id,
      );
  }

  changeSort(sort: WeaponSort[]): void {
    this.sort = sort;
    const text = sort.map(s => this.sorts.find(it => it.value === s)?.text);
    this.logger.info('updated sort', text);
  }

  changeInfoSort(sort: WeaponInfoSort[]): void {
    this.infoSort = sort;
    const text = sort.map(s => this.infoSorts.find(it => it.value === s)?.text);
    this.logger.info('updated info sort', text);
  }

  filterRarity(value: Rarity[]): void {
    this.rarityFilter = value;
    this.logger.info('updated rarityFilter', value);
  }

  filterType(value: WeaponType[]): void {
    this.typeFilter = value;
    this.logger.info('updated typeFilter', value);
  }

  private filterInfo({rarity, type}: WeaponInfo): boolean {
    return this.rarityFilter.includes(rarity) && this.typeFilter.includes(type);
  }

  private generateSorts(types: StatsType[]): WeaponSortOption[] {
    return types.map(type => ({
      text: this.i18n.stats(type),
      value: ({currentStats: a}, {currentStats: b}) =>
        b.get(type) - a.get(type),
    }));
  }
}
