import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {NGXLogger} from 'ngx-logger';
import {WeaponType} from '../../models/weapon-type.enum';
import {ImageService} from '../../../image/services/image.service';
import {toggleListItem} from '../../../shared/utils/collections';
import {WeaponStatsValue} from '../../models/weapon-stats.model';
import {Rarity} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss']
})
export class WeaponListComponent extends AbstractObservableComponent implements OnChanges {

  i18n = new I18n('weapons');

  @Input()
  weapons: Weapon[] = [];

  items!: Weapon[];

  itemsStats = new Map<number, [WeaponStatsValue, WeaponStatsValue]>();

  @Input()
  selectedItems: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @Output()
  add = new EventEmitter();

  constructor(public service: WeaponService, public images: ImageService, private logger: NGXLogger) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('weapons')) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.items = this.service.view(this.weapons);
    this.items.forEach(item => {
      this.service.getStats(item).subscribe(stats => this.itemsStats.set(item.progress.id, stats));
    });
    this.logger.info('updated items', this.items);
  }

  changeSort(sort: (a: Weapon, b: Weapon) => number): void {
    this.service.sort = sort;
    this.logger.info('updated sort', this.service.sorts.find(it => it.value === sort)?.text);
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

  select(weapon: Weapon): void {
    this.logger.info('selected weapon', weapon);
    if (this.multiSelect) {
      this.selectedItems = toggleListItem(this.selectedItems, weapon, it => it.progress.id === weapon.progress.id);
      this.multiSelected.emit(this.selectedItems);
    } else {
      this.selected.emit(weapon);
    }
  }

  onMultiSelectChange({multiSelect, selectAll}: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selectedItems = selectAll ? this.weapons : [];
    this.multiSelected.emit(this.selectedItems);
  }

  trackItem(index: number, item: Weapon): number {
    return item.progress.id;
  }
}
