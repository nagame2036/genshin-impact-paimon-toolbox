import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';

@Component({
  selector: 'app-weapon-detail-dialog',
  templateUrl: './weapon-detail-dialog.component.html',
  styleUrls: ['./weapon-detail-dialog.component.scss']
})
export class WeaponDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'weapons';

  constructor(public dialogRef: MatDialogRef<WeaponDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { weapon: PartyWeapon, plan: WeaponPlan },
              private weaponService: WeaponService, private planner: WeaponPlanner) {
    super();
  }

  ngOnInit(): void {
  }

  saveParty(): void {
    this.weaponService.updatePartyMember(this.data.weapon);
  }

  savePlan(): void {
    this.planner.updatePlan(this.data.plan);
  }

  remove(weapon: PartyWeapon): void {
    this.weaponService.removePartyMember(weapon);
    this.dialogRef.close();
  }
}
