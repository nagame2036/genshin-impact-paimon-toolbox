import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Weapon} from '../../models/weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {combineLatest, Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {allRefineRanks, RefineRank, WeaponProgress} from '../../models/weapon-progress.model';
import {WeaponInfo} from '../../models/weapon-info.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponStatsValue} from '../../models/weapon-stats.model';
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
  weapon!: Weapon;

  info!: WeaponInfo;

  progress!: WeaponProgress;

  plan!: WeaponPlan;

  stats$!: Observable<[WeaponStatsValue, WeaponStatsValue]>;

  satisfied: boolean[] = [];

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
    this.updateStats();
    if (this.planMode) {
      combineLatest(this.service.specificRequirement(this.weapon))
        .pipe(takeUntil(this.destroy$))
        .subscribe(requirements => {
          this.satisfied = requirements.map(it => it.satisfied);
          this.logger.info('updated weapon plans is satisfied?', this.satisfied);
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
    this.emitChange();
  }

  setGoalLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.logger.info(`weapon change plan ascension-level from ${this.plan.ascension}, ${this.plan.level} to ${ascension}, ${level}`);
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.updateStats();
    this.emitChange();
  }

  private emitChange(): void {
    this.logger.info('weapon changed');
    this.changed.emit();
  }

  private updateStats(): void {
    this.stats$ = this.service.getStats(this.weapon);
  }
}
