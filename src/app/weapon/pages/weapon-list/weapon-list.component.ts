import {Component, OnInit, ViewChild} from '@angular/core';
import {WeaponOverview} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponGridComponent} from '../../components/weapon-grid/weapon-grid.component';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss'],
})
export class WeaponListComponent implements OnInit {
  i18n = I18n.create('weapons');

  weapons$!: Observable<WeaponOverview[]>;

  multiSelect = false;

  selectAll = false;

  selectedItems: WeaponOverview[] = [];

  @ViewChild('list')
  list!: WeaponGridComponent;

  constructor(
    private service: WeaponService,
    private router: Router,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.logger.info('init');
    this.weapons$ = this.service.getAll();
  }

  goToAdd(): void {
    this.router.navigate(['weapons/add']).then(_ => this.updateSelected([]));
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
      selected.length === this.list.weapons.length;
  }

  onMultiSelectChange(event: {multiSelect: boolean; selectAll: boolean}): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.list.onMultiSelectChange(event);
  }
}
