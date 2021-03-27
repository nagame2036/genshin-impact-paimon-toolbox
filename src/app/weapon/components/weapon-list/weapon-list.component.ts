import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Weapon, WeaponOverview} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {NGXLogger} from 'ngx-logger';
import {ImageService} from '../../../image/services/image.service';
import {toggleItem} from '../../../shared/utils/collections';
import {WeaponViewService} from '../../services/weapon-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss'],
})
export class WeaponListComponent
  extends AbstractObservableComponent
  implements OnChanges {
  i18n = I18n.create('weapons');

  @Input()
  weapons: WeaponOverview[] = [];

  items!: WeaponOverview[];

  clickedItem: WeaponOverview | null = null;

  clickedItemMaterials!: MaterialDetail[];

  @Output()
  doubleClicked = new EventEmitter<WeaponOverview>();

  @Input()
  selectedItems: WeaponOverview[] = [];

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<WeaponOverview[]>();

  constructor(
    public service: WeaponService,
    public view: WeaponViewService,
    public level: AscensionLevelService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('weapons')) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.view.view(this.weapons).subscribe(items => {
      this.items = items;
    });
  }

  select(item: WeaponOverview): void {
    this.logger.info('clicked weapon', item);
    if (!this.multiSelect) {
      this.clickedItem = this.clickedItem === item ? null : item;
    } else {
      const origin = this.selectedItems;
      const itemId = item.progress.id;
      const list = toggleItem(origin, item, it => it.progress.id === itemId);
      this.selectedItems = list;
      this.clickedItem = list[list.length - 1] ?? null;
      this.multiSelected.emit(list);
    }
    if (this.clickedItem) {
      const info = this.clickedItem.info;
      this.clickedItemMaterials = this.service.getRequireMaterials(info);
    }
  }

  doubleClick(item: WeaponOverview): void {
    this.logger.info('double clicked weapon', item);
    this.doubleClicked.emit(item);
  }

  onMultiSelectChange({
    multiSelect,
    selectAll,
  }: {
    multiSelect: boolean;
    selectAll: boolean;
  }): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selectedItems = selectAll ? this.weapons : [];
    this.multiSelected.emit(this.selectedItems);
  }

  trackItem(index: number, item: Weapon): number {
    return item.progress.id;
  }
}
