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

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss'],
})
export class WeaponListComponent
  extends AbstractObservableComponent
  implements OnChanges {
  i18n = new I18n('weapons');

  @Input()
  weapons: WeaponOverview[] = [];

  items!: WeaponOverview[];

  @Input()
  selectedItems: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

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

  select(weapon: Weapon): void {
    this.logger.info('selected weapon', weapon);
    if (this.multiSelect) {
      this.selectedItems = toggleItem(
        this.selectedItems,
        weapon,
        it => it.progress.id === weapon.progress.id,
      );
      this.multiSelected.emit(this.selectedItems);
    } else {
      this.selected.emit(weapon);
    }
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
