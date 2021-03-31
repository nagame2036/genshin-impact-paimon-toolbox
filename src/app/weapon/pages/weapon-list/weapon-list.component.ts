import {Component, OnInit, ViewChild} from '@angular/core';
import {WeaponOverview} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponGridComponent} from '../../components/weapon-grid/weapon-grid.component';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';
import {MultiSelectEvent} from '../../../game-common/models/multi-select-event.model';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss'],
})
export class WeaponListComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('weapons');

  items: WeaponOverview[] = [];

  multiSelect = false;

  selectAll = false;

  selectedItems: WeaponOverview[] = [];

  @ViewChild('list')
  list!: WeaponGridComponent;

  constructor(
    private service: WeaponService,
    private router: Router,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.service
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(weapons => (this.items = weapons));
  }

  goToAdd(): void {
    this.router.navigate(['weapons/add']).then();
  }

  goToDetail(weapon: WeaponOverview): void {
    this.router.navigate(['weapons/progresses', weapon.progress.id]).then();
  }

  remove(): void {
    this.service.removeAll(this.selectedItems);
    this.logger.info('removed weapons', this.selectedItems);
    this.updateSelected([]);
  }

  updateSelected(selected: WeaponOverview[]): void {
    this.logger.info('updated selected weapons', selected);
    this.selectedItems = selected;
    this.selectAll =
      this.multiSelect &&
      selected.length > 0 &&
      selected.length === this.items.length;
  }

  onMultiSelect(event: MultiSelectEvent): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
  }
}
