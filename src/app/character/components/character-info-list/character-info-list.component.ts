import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ElementType} from '../../../game-common/models/element-type.enum';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';
import {CharacterInfo} from '../../models/character-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {Rarity} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-character-info-list',
  templateUrl: './character-info-list.component.html',
  styleUrls: ['./character-info-list.component.scss']
})
export class CharacterInfoListComponent implements OnChanges {

  readonly i18n = new I18n('characters');

  @Input()
  characters: CharacterInfo[] = [];

  items!: CharacterInfo[];

  @Output()
  selected = new EventEmitter<CharacterInfo>();

  constructor(public service: CharacterService, public images: ImageService, private logger: NGXLogger) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('characters')) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.items = this.service.viewInfos(this.characters);
    this.logger.info('updated items', this.items);
  }

  changeSort(sort: (a: CharacterInfo, b: CharacterInfo) => number): void {
    this.service.infoSort = sort;
    this.logger.info('updated sort', this.service.infoSorts.find(it => it.value === sort)?.text);
    this.update();
  }

  filterRarity(value: Rarity[]): void {
    this.service.rarityFilter = value;
    this.logger.info('updated rarityFilter', value);
    this.update();
  }

  filterElement(value: ElementType[]): void {
    this.service.elementFilter = value;
    this.logger.info('updated elementFilter', value);
    this.update();
  }

  filterWeapon(value: WeaponType[]): void {
    this.service.weaponFilter = value;
    this.logger.info('updated weaponFilter', value);
    this.update();
  }

  select(item: CharacterInfo): void {
    this.logger.info('selected character', item);
    this.selected.emit(item);
  }
}
