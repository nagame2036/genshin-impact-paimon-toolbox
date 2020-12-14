import {Component, OnInit} from '@angular/core';
import {Weapon} from '../../../shared/models/weapon';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WeaponService} from '../../../shared/services/weapon.service';
import {WeaponListDialogComponent} from '../../components/weapon-list-dialog/weapon-list-dialog.component';
import {WeaponDetailDialogComponent} from '../../components/weapon-detail-dialog/weapon-detail-dialog.component';

@Component({
  selector: 'app-party-weapon',
  templateUrl: './party-weapon.component.html',
  styleUrls: ['./party-weapon.component.sass']
})
export class PartyWeaponComponent implements OnInit {

  constructor(private dialog: MatDialog, private weapons: WeaponService) {
  }

  ngOnInit(): void {
  }

  openAddWeapon(): void {
    this.dialog.open(WeaponListDialogComponent, {
      width: '1920px',
      data: {
        title: 'add',
        party: false,
        action: (dialog: MatDialogRef<WeaponListDialogComponent>, weapon: Weapon) => {
          this.weapons.addPartyMember(weapon.id);
        }
      }
    });
  }

  openWeaponDetail(weapon: Weapon): void {
    this.dialog.open(WeaponDetailDialogComponent, {width: '720px', data: weapon});
  }
}
