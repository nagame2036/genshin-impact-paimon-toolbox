import {Injectable} from '@angular/core';
import {CharacterOverview} from '../models/character.model';
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
import {Observable, ReplaySubject} from 'rxjs';
import {SettingService} from '../../setting/services/setting.service';
import {CharacterViewOptions} from '../models/character-view-options.model';
import {first, map} from 'rxjs/operators';
import {sortItems} from '../../shared/utils/collections';

const i18n = new I18n('characters');

type CharacterSort = (a: CharacterOverview, b: CharacterOverview) => number;

const sortMap = new Map<string, CharacterSort>([
  [
    i18n.dict('level'),
    ({progress: a}, {progress: b}) =>
      b.ascension - a.ascension || b.level - a.level,
  ],
  [i18n.dict('rarity'), ({info: a}, {info: b}) => b.rarity - a.rarity],
  [
    i18n.dict('constellation'),
    ({progress: a}, {progress: b}) => b.constellation - a.constellation,
  ],
]);

type CharacterInfoSort = (a: CharacterInfo, b: CharacterInfo) => number;

const infoSortMap = new Map<string, CharacterInfoSort>([
  [i18n.dict('rarity'), (a, b) => b.rarity - a.rarity],
]);

@Injectable({
  providedIn: 'root',
})
export class CharacterViewService {
  private readonly settingKey = 'character-view';

  readonly sorts = [...sortMap].map(([text]) => ({text, value: text}));

  readonly infoSorts = [...infoSortMap].map(([text]) => ({text, value: text}));

  readonly rarities = allCharacterRarities.map(it => ({
    value: it,
    text: `★${it}`,
  }));

  readonly elements = allElements.map(it => ({
    value: it,
    text: i18n.dict(`elements.${it}`),
  }));

  readonly weapons = allWeaponTypes.map(it => ({
    value: it,
    text: i18n.dict(`weapon-types.${it}`),
  }));

  private options$ = new ReplaySubject<CharacterViewOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(private settings: SettingService) {
    settings
      .get(this.settingKey, () => ({
        sort: [this.sorts[0].text],
        infoSort: [this.infoSorts[0].text],
        rarities: allCharacterRarities,
        elements: allElements,
        weapons: allWeaponTypes,
      }))
      .subscribe(options => this.options$.next(options));
  }

  view(characters: CharacterOverview[]): Observable<CharacterOverview[]> {
    return this.options.pipe(
      first(),
      map(options => {
        const sorts = options.sort.map(it => sortMap.get(it) ?? (() => 0));
        const filtered = characters.filter(c => filterInfo(c.info, options));
        return sortItems(filtered, [...sorts, (a, b) => b.info.id - a.info.id]);
      }),
    );
  }

  viewInfos(characters: CharacterInfo[]): Observable<CharacterInfo[]> {
    return this.options.pipe(
      first(),
      map(options => {
        const option = options.infoSort;
        const sorts = option.map(it => infoSortMap.get(it) ?? (() => 0));
        const filtered = characters.filter(c => filterInfo(c, options));
        return sortItems(filtered, [...sorts, (a, b) => b.id - a.id]);
      }),
    );
  }

  changeSort(sort: string[]): void {
    this.updateView({sort});
  }

  changeInfoSort(sort: string[]): void {
    this.updateView({infoSort: sort});
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

  private updateView(update: Partial<CharacterViewOptions>): void {
    this.options.pipe(first()).subscribe(options => {
      Object.assign(options, update);
      this.settings.set(this.settingKey, options);
    });
  }
}

function filterInfo(
  {rarity, element, weapon}: CharacterInfo,
  {rarities, elements, weapons}: CharacterViewOptions,
): boolean {
  return (
    rarities.includes(rarity) &&
    elements.includes(element) &&
    weapons.includes(weapon)
  );
}
