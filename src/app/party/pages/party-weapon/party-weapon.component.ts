import {Component, OnInit, ViewChild} from '@angular/core';
import {Weapon} from '../../../weapon/models/weapon.model';
import {MatDialog} from '@angular/material/dialog';
import {AddWeaponDialogComponent} from '../../components/add-weapon-dialog/add-weapon-dialog.component';
import {WeaponDetailDialogComponent} from '../../components/weapon-detail-dialog/weapon-detail-dialog.component';
import {I18n} from '../../../shared/models/i18n.model';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';
import {PartyWeaponListComponent} from '../../../weapon/components/party-weapon-list/party-weapon-list.component';
import {first} from 'rxjs/operators';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';

@Component({
  selector: 'app-party-weapon',
  templateUrl: './party-weapon.component.html',
  styleUrls: ['./party-weapon.component.scss']
})
export class PartyWeaponComponent implements OnInit {

  i18n = new I18n('weapons');

  multiSelect = false;

  selectAll = false;

  selectedItems: Weapon[] = [];

  @ViewChild('list')
  list!: PartyWeaponListComponent;

  constructor(private dialog: MatDialog, private service: WeaponService, private planner: WeaponPlanner) {
  }

  ngOnInit(): void {
  }

  openAddDialog(): void {
    this.dialog.open(AddWeaponDialogComponent).afterClosed().subscribe(_ => this.updateSelected([]));
  }

  openDetail(weapon: Weapon): void {
    const party = weapon as PartyWeapon;
    if (!party || !party.key) {
      return;
    }
    this.planner.getPlan(party.key).pipe(first()).subscribe(plan => {
      this.dialog.open(WeaponDetailDialogComponent, {data: {weapon, plan}});
    });
  }

  openRemoveDialog(): void {
    this.dialog.open(RemoveConfirmDialogComponent, {data: {category: 'weapons', items: this.selectedItems}})
      .afterClosed().subscribe(remove => {
      if (remove) {
        this.service.removePartyMemberByList(this.selectedItems.map(it => it.id));
        this.updateSelected([]);
      }
    });
  }

  updateSelected(selected: Weapon[]): void {
    this.selectedItems = selected;
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.weapons.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.selectAll = event.selectAll;
    this.list.onMultiSelectChange(event);
  }
}
