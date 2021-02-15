import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponWithStats} from '../../models/weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {NGXLogger} from 'ngx-logger';
import {allRefineRanks, RefineRank, WeaponProgress} from '../../models/weapon-progress.model';
import {WeaponInfo} from '../../models/weapon-info.model';
import {WeaponService} from '../../services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-weapon-plan-form',
  templateUrl: './weapon-plan-form.component.html',
  styleUrls: ['./weapon-plan-form.component.scss']
})
export class WeaponPlanFormComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  weapon!: WeaponWithStats;

  info!: WeaponInfo;

  progress!: WeaponProgress;

  plan!: WeaponPlan;

  reachedStates: boolean[] = [];

  @Input()
  planMode = false;

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
    if (this.planMode) {
      this.service.specificRequirement(this.weapon)
        .pipe(takeUntil(this.destroy$))
        .subscribe(requirements => {
          this.reachedStates = requirements.map(it => it.reached);
          this.logger.info('updated weapon plan reached requirement', this.reachedStates);
        });
    }
  }

  setRefineRank(refine: RefineRank): void {
    this.logger.info(`weapon change refine from ${this.progress.refine} to ${refine}`);
    this.progress.refine = refine;
    this.emitChange();
  }

  setCurrentLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.logger.info(`weapon change ascension-level from ${this.progress.ascension}, ${this.progress.level} to ${ascension}, ${level}`);
    this.progress.ascension = ascension;
    this.progress.level = level;
    this.updateStats();
  }

  setGoalLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.logger.info(`weapon change plan ascension-level from ${this.plan.ascension}, ${this.plan.level} to ${ascension}, ${level}`);
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.updateStats();
  }

  private emitChange(): void {
    this.logger.info('weapon changed');
    this.changed.emit();
  }

  private updateStats(): void {
    this.service.getStats(this.weapon).subscribe(weapon => {
      this.weapon = weapon;
      this.emitChange();
    });
  }
}
