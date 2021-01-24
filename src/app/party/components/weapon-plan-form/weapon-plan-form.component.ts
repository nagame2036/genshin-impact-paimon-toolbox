import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {rangeList} from '../../../shared/utils/range-list';
import {RefineRank} from '../../../weapon/models/refine-rank.type';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-weapon-plan-form',
  templateUrl: './weapon-plan-form.component.html',
  styleUrls: ['./weapon-plan-form.component.scss']
})
export class WeaponPlanFormComponent implements OnInit {

  i18n = new I18n('party');

  @Input()
  weapon!: PartyWeapon;

  @Input()
  plan!: WeaponPlan;

  @Input()
  plans: { satisfied: Observable<boolean> }[] = [
    {satisfied: new Subject()},
  ];

  refineRanks = (rangeList(1, 5) as RefineRank[]).map(it => ({value: it, text: `${it}`}));

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter<WeaponPlan>();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor() {
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
