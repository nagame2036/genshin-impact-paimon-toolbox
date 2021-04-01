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
import {MultiSelectEvent} from '../../../game-common/models/multi-select-event.model';

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

  clicked: WeaponOverview | null = null;

  summaryMaterials!: MaterialDetail[];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<WeaponOverview>();

  @Input()
  selected: WeaponOverview[] = [];

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
      this.clicked = this.clicked === item ? null : item;
    } else {
      const id = item.progress.id;
      const list = toggleItem(this.selected, item, it => it.progress.id === id);
      this.selected = list;
      this.clicked = list[list.length - 1] ?? null;
      this.multiSelected.emit(list);
    }
    if (this.clicked) {
      this.summaryMaterials = this.service.getRequireMaterials(item.info);
    }
  }

  doubleClick(item: WeaponOverview): void {
    this.logger.info('double clicked weapon', item);
    this.doubleClicked.emit(item);
  }

  onMultiSelect({multiSelect, selectAll}: MultiSelectEvent): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selected = selectAll ? this.weapons : [];
    this.multiSelected.emit(this.selected);
  }

  trackItem(index: number, item: Weapon): number {
    return item.progress.id;
  }
}