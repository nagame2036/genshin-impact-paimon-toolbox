import {Injectable} from '@angular/core';
import {CharacterOverview} from '../models/character.model';
import {allCharacterRarities, CharacterInfo} from '../models/character-info.model';
import {allElements, ElementType} from '../../game-common/models/element-type.type';
import {allWeaponTypes, WeaponType} from '../../weapon/models/weapon-type.type';
import {I18n} from '../../widget/models/i18n.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {SettingService} from '../../setting/services/setting.service';
import {CharacterViewOptions} from '../models/character-options.model';
import {ItemSort, ItemViewService} from '../../game-common/services/item-view.service';
import {CharacterService} from './character.service';

const i18n = I18n.create('character');

const sortMap = new Map<string, ItemSort<CharacterOverview>>([
  [
    i18n.dict('level'),
    ({progress: a}, {progress: b}) => b.ascension - a.ascension || b.level - a.level,
  ],
  [i18n.dict('rarity'), ({info: a}, {info: b}) => b.rarity - a.rarity],
  [i18n.dict('constellation'), ({progress: a}, {progress: b}) => b.constellation - a.constellation],
]);

const infoSortMap = new Map<string, ItemSort<CharacterInfo>>([
  [i18n.dict('rarity'), (a, b) => b.rarity - a.rarity],
]);

@Injectable({
  providedIn: 'root',
})
export class CharacterViewService extends ItemViewService<CharacterOverview, CharacterViewOptions> {
  readonly rarities = allCharacterRarities.map(it => ({value: it, text: `★${it}`}));

  readonly elements = allElements.map(it => ({
    value: it,
    text: i18n.data(`element.${it}`),
  }));

  readonly weapons = allWeaponTypes.map(it => ({
    value: it,
    text: i18n.data(`weapon-type.${it}`),
  }));

  constructor(characters: CharacterService, settings: SettingService) {
    super(characters.type, sortMap, infoSortMap, settings, 'character-view', {
      rarities: allCharacterRarities,
      elements: [...allElements],
      weapons: [...allWeaponTypes],
    });
  }

  filterRarity(rarities: Rarity[]): void {
    this.updateView({rarities});
  }

  filterElement(elements: ElementType[]): void {
    this.updateView({elements});
  }

  filterWeapon(weapons: WeaponType[]): void {
    this.updateView({weapons});
  }

  protected filterInfo(
    {rarity, element, weapon}: CharacterInfo,
    {rarities, elements, weapons}: CharacterViewOptions,
  ): boolean {
    return rarities.includes(rarity) && elements.includes(element) && weapons.includes(weapon);
  }
}
