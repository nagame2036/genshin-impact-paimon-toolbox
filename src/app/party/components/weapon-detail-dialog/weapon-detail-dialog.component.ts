import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WeaponService} from '../../../shared/services/weapon.service';
import {PartyWeapon} from '../../../shared/models/party-weapon';

@Component({
  selector: 'app-weapon-detail-dialog',
  templateUrl: './weapon-detail-dialog.component.html',
  styleUrls: ['./weapon-detail-dialog.component.sass']
})
export class WeaponDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  constructor(public dialogRef: MatDialogRef<WeaponDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: PartyWeapon,
              private weapons: WeaponService) {
    super();
  }

  ngOnInit(): void {
  }

  removeWeapon(weapon: PartyWeapon): void {
    this.weapons.removePartyMember(weapon);
    this.dialogRef.close();
  }
}
