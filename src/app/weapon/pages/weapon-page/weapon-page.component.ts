import {Component, OnInit, ViewChild} from '@angular/core';
import {Weapon, WeaponOverview} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponListComponent} from '../../components/weapon-list/weapon-list.component';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-weapon-page',
  templateUrl: './weapon-page.component.html',
  styleUrls: ['./weapon-page.component.scss']
})
export class WeaponPageComponent implements OnInit {

  i18n = new I18n('weapons');

  weapons$!: Observable<WeaponOverview[]>;

  multiSelect = false;

  selectAll = false;

  selectedItems: Weapon[] = [];

  @ViewChild('list')
  list!: WeaponListComponent;

  constructor(private service: WeaponService, private router: Router, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.weapons$ = this.service.getAll();
  }

  goToAdd(): void {
    this.router.navigate(['weapons/add']).then(_ => this.updateSelected([]));
  }

  goToDetail(weapon: Weapon): void {
    this.router.navigate(['weapons', weapon.progress.id]).then();
  }

  remove(): void {
    this.service.removeAll(this.selectedItems);
    this.logger.info('removed weapons', this.selectedItems);
    this.updateSelected([]);
  }

  updateSelected(selected: Weapon[]): void {
    this.logger.info('updated selected characters', selected);
    this.selectedItems = selected;
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.weapons.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.logger.debug(`multi-select: ${this.multiSelect}, select-all: ${this.selectAll}`);
    this.list.onMultiSelectChange(event);
  }
}
