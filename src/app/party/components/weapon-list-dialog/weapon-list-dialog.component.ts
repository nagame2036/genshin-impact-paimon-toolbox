import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Weapon} from '../../../shared/models/weapon';
import {WeaponListDialogData} from '../../models/weapon-list-dialog-data';

@Component({
  selector: 'app-weapon-list-dialog',
  templateUrl: './weapon-list-dialog.component.html',
  styleUrls: ['./weapon-list-dialog.component.sass']
})
export class WeaponListDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  constructor(public dialogRef: MatDialogRef<WeaponListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: WeaponListDialogData) {
    super();
  }

  ngOnInit(): void {
  }

  selectWeapon(weapon: Weapon): void {
    this.data.action(this.dialogRef, weapon);
  }

}
