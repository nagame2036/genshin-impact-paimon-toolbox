import {Injectable} from '@angular/core';
import {Character, CharacterOverview} from '../models/character.model';
import {
  allCharacterRarities,
  CharacterInfo,
} from '../models/character-info.model';
import {
  allElements,
  ElementType,
} from '../../game-common/models/element-type.enum';
import {allWeaponTypes, WeaponType} from '../../weapon/models/weapon-type.enum';
import {I18n} from '../../widget/models/i18n.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {NGXLogger} from 'ngx-logger';

type CharacterSort = {
  text: string;
  value: (a: CharacterOverview, b: CharacterOverview) => number;
};

type CharacterInfoSort = {
  text: string;
  value: (a: CharacterInfo, b: CharacterInfo) => number;
};

@Injectable({
  providedIn: 'root',
})
export class CharacterViewService {
  private readonly i18n = new I18n('characters');

  readonly sorts: CharacterSort[] = [
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
      text: this.i18n.dict('constellation'),
      value: ({progress: a}, {progress: b}) =>
        b.constellation - a.constellation,
    },
  ];

  sort = this.sorts[0].value;

  readonly infoSorts: CharacterInfoSort[] = [
    {text: this.i18n.dict('rarity'), value: (a, b) => b.rarity - a.rarity},
  ];

  infoSort = this.infoSorts[0].value;

  readonly rarities = allCharacterRarities.map(it => ({
    value: it,
    text: `★${it}`,
  }));

  rarityFilter = allCharacterRarities;

  readonly elements = allElements.map(it => ({
    value: it,
    text: this.i18n.dict(`elements.${it}`),
  }));

  elementFilter = allElements;

  readonly weapons = allWeaponTypes.map(it => ({
    value: it,
    text: this.i18n.dict(`weapon-types.${it}`),
  }));

  weaponFilter = allWeaponTypes;

  constructor(private logger: NGXLogger) {}

  view(characters: CharacterOverview[]): CharacterOverview[] {
    return characters
      .filter(c => this.filterInfo(c.info))
      .sort((a, b) => this.sort(a, b) || b.info.id - a.info.id);
  }

  viewInfos(characters: CharacterInfo[]): CharacterInfo[] {
    return characters
      .filter(c => this.filterInfo(c))
      .sort((a, b) => this.infoSort(a, b) || b.id - a.id);
  }

  changeSort(sort: (a: Character, b: Character) => number): void {
    this.sort = sort;
    const text = this.sorts.find(it => it.value === sort)?.text;
    this.logger.info('updated sort', text);
  }

  changeInfoSort(sort: (a: CharacterInfo, b: CharacterInfo) => number): void {
    this.infoSort = sort;
    const text = this.infoSorts.find(it => it.value === sort)?.text;
    this.logger.info('updated sort', text);
  }

  filterRarity(value: Rarity[]): void {
    this.rarityFilter = value;
    this.logger.info('updated rarityFilter', value);
  }

  filterElement(value: ElementType[]): void {
    this.elementFilter = value;
    this.logger.info('updated elementFilter', value);
  }

  filterWeapon(value: WeaponType[]): void {
    this.weaponFilter = value;
    this.logger.info('updated weaponFilter', value);
  }

  private filterInfo({element, rarity, weapon}: CharacterInfo): boolean {
    return (
      this.rarityFilter.includes(rarity) &&
      this.elementFilter.includes(element) &&
      this.weaponFilter.includes(weapon)
    );
  }
}
