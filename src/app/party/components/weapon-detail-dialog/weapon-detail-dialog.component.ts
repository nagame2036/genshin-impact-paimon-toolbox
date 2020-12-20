import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WeaponService} from '../../../shared/services/weapon.service';
import {PartyWeapon} from '../../../shared/models/party-weapon';
import {rangeList} from '../../../shared/utils/range-list';
import {RefineRank} from '../../../shared/models/refine-rank';
import {AscensionLevel} from '../../../shared/models/ascension-level.model';

@Component({
  selector: 'app-weapon-detail-dialog',
  templateUrl: './weapon-detail-dialog.component.html',
  styleUrls: ['./weapon-detail-dialog.component.sass']
})
export class WeaponDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  refineRanks = rangeList(1, 5) as RefineRank[];

  refine: RefineRank = 1;

  ascension = 0;

  level = 1;

  constructor(public dialogRef: MatDialogRef<WeaponDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: PartyWeapon,
              private weaponService: WeaponService) {
    super();
  }

  get weapon(): PartyWeapon {
    return {...this.data, refine: this.refine, ascension: this.ascension, level: this.level};
  }

  ngOnInit(): void {
    // avoid NG0100: ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.refine = this.data.refine;
      this.ascension = this.data.ascension;
      this.level = this.data.level;
    }, 5);
  }

  setRefine(refine: RefineRank): void {
    this.refine = refine;
    this.weaponService.updatePartyMember(this.weapon);
  }

  setLevel(event: { current: AscensionLevel; target: AscensionLevel }): void {
    this.ascension = event.current.ascension;
    this.level = event.current.level;
    this.weaponService.updatePartyMember(this.weapon);
  }

  remove(weapon: PartyWeapon): void {
    this.weaponService.removePartyMember(weapon);
    this.dialogRef.close();
  }
}
