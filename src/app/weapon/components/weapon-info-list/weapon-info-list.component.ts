import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponType} from '../../models/weapon-type.enum';
import {WeaponInfo} from '../../models/weapon-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {WeaponService} from '../../services/weapon.service';
import {Rarity} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-weapon-info-list',
  templateUrl: './weapon-info-list.component.html',
  styleUrls: ['./weapon-info-list.component.scss']
})
export class WeaponInfoListComponent implements OnChanges {

  readonly i18n = new I18n('weapons');

  @Input()
  weapons: WeaponInfo[] = [];

  items!: WeaponInfo[];

  @Output()
  selected = new EventEmitter<WeaponInfo>();

  constructor(public service: WeaponService, public images: ImageService, private logger: NGXLogger) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('weapons')) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.items = this.service.viewInfos(this.weapons);
    this.logger.info('updated items', this.items);
  }

  changeSort(sort: (a: WeaponInfo, b: WeaponInfo) => number): void {
    this.service.infoSort = sort;
    this.logger.info('updated sort', this.service.infoSorts.find(it => it.value === sort)?.text);
    this.update();
  }

  filterRarity(value: Rarity[]): void {
    this.service.rarityFilter = value;
    this.logger.info('updated rarityFilter', value);
    this.update();
  }

  filterType(value: WeaponType[]): void {
    this.service.typeFilter = value;
    this.logger.info('updated typeFilter', value);
    this.update();
  }

  select(item: WeaponInfo): void {
    this.logger.info('selected character', item);
    this.selected.emit(item);
  }
}
