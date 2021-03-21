import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponOverview} from '../../models/weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {NGXLogger} from 'ngx-logger';
import {
  allRefineRanks,
  RefineRank,
  WeaponProgress,
} from '../../models/weapon-progress.model';
import {WeaponInfo} from '../../models/weapon-info.model';
import {WeaponService} from '../../services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-weapon-plan-form',
  templateUrl: './weapon-plan-form.component.html',
  styleUrls: ['./weapon-plan-form.component.scss'],
})
export class WeaponPlanFormComponent
  extends AbstractObservableComponent
  implements OnInit {
  i18n = new I18n('game-common');

  @Input()
  weapon!: WeaponOverview;

  info!: WeaponInfo;

  progress!: WeaponProgress;

  plan!: WeaponPlan;

  @Input()
  reachedStates: boolean[] = [];

  refineRanks = allRefineRanks.map(it => ({value: it, text: `${it}`}));

  @Output()
  changed = new EventEmitter();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(public service: WeaponService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init with weapon', this.weapon);
    this.info = this.weapon.info;
    this.progress = this.weapon.progress;
    this.plan = this.weapon.plan;
  }

  setRefineRank(refine: RefineRank): void {
    this.logger.info(`change refine to ${refine}`);
    this.progress.refine = refine;
    this.emitChange();
  }

  setCurrLevel({ascension, level}: AscensionLevel): void {
    this.logger.info(`change ascension-level to ${ascension}, ${level}`);
    this.progress.ascension = ascension;
    this.progress.level = level;
    this.updateStats();
  }

  setPlanLevel({ascension, level}: AscensionLevel): void {
    this.logger.info(`change plan ascension-level to ${ascension}, ${level}`);
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.updateStats();
  }

  private emitChange(): void {
    this.logger.info('weapon changed');
    this.changed.emit();
  }

  private updateStats(): void {
    this.weapon = this.service.getOverview(this.weapon);
    this.emitChange();
  }
}
