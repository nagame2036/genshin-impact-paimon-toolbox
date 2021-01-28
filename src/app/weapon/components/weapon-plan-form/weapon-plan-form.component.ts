import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {rangeList} from '../../../shared/utils/range-list';
import {RefineRank} from '../../models/refine-rank.type';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {Observable, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-weapon-plan-form',
  templateUrl: './weapon-plan-form.component.html',
  styleUrls: ['./weapon-plan-form.component.scss']
})
export class WeaponPlanFormComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  weapon!: PartyWeapon;

  @Input()
  plan!: WeaponPlan;

  @Input()
  requirements: { satisfied: Observable<boolean> }[] = [
    {satisfied: new Subject()},
  ];

  refineRanks = (rangeList(1, 5) as RefineRank[]).map(it => ({value: it, text: `${it}`}));

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter<WeaponPlan>();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  setRefineRank(refine: RefineRank): void {
    this.logger.info(`constellation from ${this.weapon.refine} to ${refine}`);
    this.weapon.refine = refine;
    this.emitCurrentChange();
  }

  setCurrentLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.logger.info(`weapon ascension-level from ${this.weapon.ascension}, ${this.weapon.level} to ${ascension}, ${level}`);
    this.weapon.ascension = ascension;
    this.weapon.level = level;
    this.emitCurrentChange();
  }

  setGoalLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.logger.info(`plan ascension-level from ${this.plan.ascension}, ${this.plan.level} to ${ascension}, ${level}`);
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.emitGoalChange();
  }

  private emitCurrentChange(): void {
    this.logger.info('current changed');
    this.currentChange.emit();
  }

  private emitGoalChange(): void {
    this.logger.info('goal changed');
    this.goalChange.emit();
  }
}
