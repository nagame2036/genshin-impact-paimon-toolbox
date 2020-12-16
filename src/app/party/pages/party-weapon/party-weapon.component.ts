import {Component, OnInit} from '@angular/core';
import {Weapon} from '../../../shared/models/weapon';
import {MatDialog} from '@angular/material/dialog';
import {AddWeaponDialogComponent} from '../../components/add-weapon-dialog/add-weapon-dialog.component';
import {WeaponDetailDialogComponent} from '../../components/weapon-detail-dialog/weapon-detail-dialog.component';

@Component({
  selector: 'app-party-weapon',
  templateUrl: './party-weapon.component.html',
  styleUrls: ['./party-weapon.component.sass']
})
export class PartyWeaponComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openAddWeapon(): void {
    this.dialog.open(AddWeaponDialogComponent, {data: {party: false}});
  }

  openWeaponDetail(weapon: Weapon): void {
    this.dialog.open(WeaponDetailDialogComponent, {data: weapon});
  }
}
