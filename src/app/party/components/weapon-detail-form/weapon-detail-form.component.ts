import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {PartyWeapon} from '../../../character-and-gear/models/party-weapon.model';
import {rangeList} from '../../../shared/utils/range-list';
import {RefineRank} from '../../../character-and-gear/models/refine-rank.type';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';

@Component({
  selector: 'app-weapon-detail-form',
  templateUrl: './weapon-detail-form.component.html',
  styleUrls: ['./weapon-detail-form.component.sass']
})
export class WeaponDetailFormComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party';

  @Input()
  weapon!: PartyWeapon;

  @Input()
  plan!: WeaponPlan;

  refineRanks = rangeList(1, 5) as RefineRank[];

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter<WeaponPlan>();

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setRefineRank(refine: RefineRank): void {
    this.weapon.refine = refine;
    this.emitCurrentChange();
  }

  setCurrentLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.weapon.ascension = ascension;
    this.weapon.level = level;
    this.emitCurrentChange();
  }

  setGoalLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.emitGoalChange();
  }

  private emitCurrentChange(): void {
    this.currentChange.emit();
  }

  private emitGoalChange(): void {
    this.goalChange.emit();
  }
}
