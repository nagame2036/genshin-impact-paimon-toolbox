import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WeaponService} from '../../../character-and-gear/services/weapon.service';
import {PartyWeapon} from '../../../character-and-gear/models/party-weapon.model';
import {rangeList} from '../../../shared/utils/range-list';
import {RefineRank} from '../../../character-and-gear/models/refine-rank.type';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {toAscensionLevel} from '../../../plan/models/levelup-plan.model';

@Component({
  selector: 'app-weapon-detail-dialog',
  templateUrl: './weapon-detail-dialog.component.html',
  styleUrls: ['./weapon-detail-dialog.component.sass']
})
export class WeaponDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  refineRanks = rangeList(1, 5) as RefineRank[];

  refine: RefineRank = 1;

  ascension = Ascension.ZERO;

  targetAscension = Ascension.ZERO;

  level = 1;

  targetLevel = 1;

  constructor(public dialogRef: MatDialogRef<WeaponDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { weapon: PartyWeapon, plan: WeaponPlan },
              private weaponService: WeaponService, private planner: WeaponPlanner) {
    super();
    const {weapon: weapon, plan: plan} = data;
    this.refine = weapon.refine;
    this.ascension = weapon.ascension;
    this.level = weapon.level;
    const {ascension: ascension, level: level} = toAscensionLevel(plan.levelup);
    this.targetAscension = ascension;
    this.targetLevel = level;
  }

  ngOnInit(): void {
  }

  setRefine(refine: RefineRank): void {
    this.refine = refine;
    this.save();
  }

  setLevel(event: { current: AscensionLevel; target: AscensionLevel }): void {
    this.ascension = event.current.ascension;
    this.level = event.current.level;
    this.targetAscension = event.target.ascension;
    this.targetLevel = event.target.level;
    this.save();
  }

  save(): void {
    const weapon = {...this.data.weapon, refine: this.refine, ascension: this.ascension, level: this.level};
    this.weaponService.updatePartyMember(weapon);
    this.planner.updatePlan(this.data.plan.id, this.targetAscension, this.targetLevel);
  }

  remove(weapon: PartyWeapon): void {
    this.weaponService.removePartyMember(weapon);
    this.dialogRef.close();
  }
}
