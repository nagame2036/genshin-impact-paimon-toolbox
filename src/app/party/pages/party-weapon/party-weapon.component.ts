import {Component, OnInit, ViewChild} from '@angular/core';
import {Weapon} from '../../../shared/models/weapon';
import {MatDialog} from '@angular/material/dialog';
import {AddWeaponDialogComponent} from '../../components/add-weapon-dialog/add-weapon-dialog.component';
import {WeaponDetailDialogComponent} from '../../components/weapon-detail-dialog/weapon-detail-dialog.component';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponService} from '../../../shared/services/weapon.service';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';
import {PartyWeaponListComponent} from '../../components/party-weapon-list/party-weapon-list.component';
import {PartyWeapon} from '../../../shared/models/party-weapon';

@Component({
  selector: 'app-party-weapon',
  templateUrl: './party-weapon.component.html',
  styleUrls: ['./party-weapon.component.sass']
})
export class PartyWeaponComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  multiSelect = false;

  selectAll = false;

  selectedItems: Weapon[] = [];

  @ViewChild('list')
  list!: PartyWeaponListComponent;

  constructor(private dialog: MatDialog, private service: WeaponService) {
    super();
  }

  ngOnInit(): void {
  }

  openAddDialog(): void {
    this.dialog.open(AddWeaponDialogComponent).afterClosed().subscribe(_ => this.updateSelected([]));
  }

  openDetail(weapon: Weapon): void {
    this.dialog.open(WeaponDetailDialogComponent, {data: weapon as PartyWeapon});
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
