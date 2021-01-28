import {Component, OnInit, ViewChild} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {PartyWeaponListComponent} from '../../components/party-weapon-list/party-weapon-list.component';
import {PartyWeapon} from '../../models/party-weapon.model';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-weapon-page',
  templateUrl: './weapon-page.component.html',
  styleUrls: ['./weapon-page.component.scss']
})
export class WeaponPageComponent implements OnInit {

  i18n = new I18n('weapons');

  multiSelect = false;

  selectAll = false;

  selectedItems: PartyWeapon[] = [];

  @ViewChild('list')
  list!: PartyWeaponListComponent;

  constructor(private service: WeaponService, private router: Router, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  goToAdd(): void {
    this.router.navigate(['weapons/add']).then(_ => this.updateSelected([]));
  }

  goToDetail(weapon: Weapon): void {
    const party = weapon as PartyWeapon;
    if (party.key) {
      this.router.navigate(['weapons', party.key]).then();
    }
  }

  remove(): void {
    this.service.removePartyMemberByList(this.selectedItems.map(it => it.key ?? -1));
    this.logger.info('removed weapons', this.selectedItems);
    this.updateSelected([]);
  }

  updateSelected(selected: Weapon[]): void {
    this.selectedItems = selected as PartyWeapon[];
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.weapons.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.logger.debug(`multi-select: ${this.multiSelect}, select-all: ${this.selectAll}`);
    this.list.onMultiSelectChange(event);
  }
}
