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
import {NGXLogger} from 'ngx-logger';
import {ImageService} from '../../../image/services/image.service';
import {toggleItem} from '../../../shared/utils/collections';
import {WeaponViewService} from '../../services/weapon-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';

@Component({
  selector: 'app-weapon-grid',
  templateUrl: './weapon-grid.component.html',
  styleUrls: ['./weapon-grid.component.scss'],
})
export class WeaponGridComponent implements OnChanges {
  i18n = I18n.create('weapons');

  @Input()
  weapons: WeaponOverview[] = [];

  items!: WeaponOverview[];

  @Input()
  clickText!: string;

  clickedItem: WeaponOverview | null = null;

  clickedItemMaterials!: MaterialDetail[];

  @Input()
  doubleClickText!: string;

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
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weapons) {
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

  onMultiSelectChange(event: {multiSelect: boolean; selectAll: boolean}): void {
    this.multiSelect = event.multiSelect;
    this.logger.info('select all', event.selectAll);
    this.selectedItems = event.selectAll ? this.weapons : [];
    this.multiSelected.emit(this.selectedItems);
  }

  trackItem(index: number, item: Weapon): number {
    return item.progress.id;
  }
}
