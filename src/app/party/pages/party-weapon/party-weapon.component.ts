import {Component, OnInit, ViewChild} from '@angular/core';
import {Weapon} from '../../../weapon/models/weapon.model';
import {MatDialog} from '@angular/material/dialog';
import {I18n} from '../../../shared/models/i18n.model';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';
import {PartyWeaponListComponent} from '../../../weapon/components/party-weapon-list/party-weapon-list.component';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-party-weapon',
  templateUrl: './party-weapon.component.html',
  styleUrls: ['./party-weapon.component.scss']
})
export class PartyWeaponComponent implements OnInit {

  i18n = new I18n('weapons');

  multiSelect = false;

  selectAll = false;

  selectedItems: PartyWeapon[] = [];

  @ViewChild('list')
  list!: PartyWeaponListComponent;

  constructor(private dialog: MatDialog, private router: Router, private service: WeaponService) {
  }

  ngOnInit(): void {
  }

  goToAdd(): void {
    this.router.navigate(['party/add-weapon']).then(_ => this.updateSelected([]));
  }

  goToDetail(weapon: Weapon): void {
    const party = weapon as PartyWeapon;
    if (party.key) {
      this.router.navigate(['party/weapons', party.key]).then();
    }
  }

  openRemoveDialog(): void {
    RemoveConfirmDialogComponent.openBy(this.dialog, 'weapons', this.selectedItems, () => {
      this.service.removePartyMemberByList(this.selectedItems.map(it => it.key ?? -1));
      this.updateSelected([]);
    });
  }

  updateSelected(selected: Weapon[]): void {
    this.selectedItems = selected as PartyWeapon[];
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.weapons.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.list.onMultiSelectChange(event);
  }
}
