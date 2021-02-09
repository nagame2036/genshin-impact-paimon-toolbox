import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterWithStats} from '../../models/character.model';
import {allConstellations, CharacterProgress, Constellation} from '../../models/character-progress.model';
import {TalentInfoService} from '../../services/talent-info.service';
import {TalentLevel} from '../../models/talent-info.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {CharacterPlan} from '../../models/character-plan.model';
import {combineLatest} from 'rxjs';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {MaterialService} from '../../../material/services/material.service';
import {CharacterInfo} from '../../models/character-info.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-character-plan-form',
  templateUrl: './character-plan-form.component.html',
  styleUrls: ['./character-plan-form.component.scss']
})
export class CharacterPlanFormComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  character!: CharacterWithStats;

  info!: CharacterInfo;

  progress!: CharacterProgress;

  plan!: CharacterPlan;

  satisfied: boolean[] = [];

  @Input()
  planMode = false;

  constellations!: SelectOption[];

  talentLevels: { [id: number]: SelectOption[] } = {};

  goalTalentLevels: { [id: number]: SelectOption[] } = {};

  @Output()
  changed = new EventEmitter();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(public service: CharacterService, public talents: TalentInfoService, public materials: MaterialService,
              private translator: TranslateService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init with character', this.character);
    this.info = this.character.info;
    this.progress = this.character.progress;
    this.plan = this.character.plan;
    this.constellations = allConstellations.map(it => {
      return {value: it, text: `${it} - ${this.translator.instant(this.getConstellationText(it))}`};
    });
    this.updateTalentLevels();
    this.updateGoalTalentLevels();
    if (this.planMode) {
      combineLatest(this.service.specificRequirement(this.character))
        .pipe(takeUntil(this.destroy$))
        .subscribe(requirements => {
          this.satisfied = requirements.map(it => it.satisfied);
          this.logger.info('updated character plans is satisfied?', this.satisfied);
        });
    }
  }

  getConstellationText(constellation: Constellation): string {
    return this.i18n.dict(constellation === 0 ? 'none' : `constellations.${this.character.info.id}.${constellation}`);
  }

  setConstellation(constellation: Constellation): void {
    const progress = this.progress;
    this.logger.info(`character change constellation from ${progress.constellation} to ${constellation}`);
    progress.constellation = constellation;
    this.emitChange();
  }

  setCurrentLevel({ascension, level}: AscensionLevel): void {
    const progress = this.progress;
    this.logger.info(`character change ascension-level from (${progress.ascension}, ${progress.level}) to (${ascension}, ${level})`);
    progress.ascension = ascension;
    progress.level = level;
    this.talents.correctLevels(progress.talents, ascension);
    this.updateTalentLevels();
    this.updateStats();
  }

  setGoalLevel({ascension, level}: AscensionLevel): void {
    const plan = this.plan;
    this.logger.info(`character change plan ascension-level from (${plan.ascension}, ${plan.level}) to (${ascension}, ${level})`);
    plan.ascension = ascension;
    plan.level = level;
    this.correctGoalTalents();
    this.updateStats();
  }

  setTalent(id: number, level: number): void {
    const progress = this.progress;
    this.logger.info(`character change talent level from ${progress.talents[id]} to ${level}`);
    progress.talents[id] = this.talents.correctLevel(progress.ascension, level);
    this.correctGoalTalents();
    this.emitChange();
  }

  setGoalTalent(id: number, level: number): void {
    const plan = this.plan;
    this.logger.info(`character change plan talent level from ${plan.talents[id]} to ${level}`);
    plan.talents[id] = this.talents.correctLevel(plan.ascension, level);
    this.emitChange();
  }

  private updateTalentLevels(): void {
    for (const talent of this.info.talentsUpgradable) {
      const levels = this.talents.levels(this.progress.ascension);
      this.talentLevels[talent] = mapTalentLevels(levels);
    }
  }

  private updateGoalTalentLevels(): void {
    for (const talent of this.info.talentsUpgradable) {
      const levels = this.talents.levels(this.plan.ascension, this.progress.talents[talent] ?? 1);
      this.goalTalentLevels[talent] = mapTalentLevels(levels);
    }
  }

  private correctGoalTalents(): void {
    const talents = this.progress.talents;
    const {ascension, talents: goalTalents} = this.plan;
    this.talents.correctLevels(goalTalents, ascension, talents);
    this.updateGoalTalentLevels();
  }

  private emitChange(): void {
    this.logger.info('character changed');
    this.changed.emit();
  }

  private updateStats(): void {
    this.service.getStats(this.character).subscribe(character => {
      this.character = character;
      this.emitChange();
    });
  }
}

function mapTalentLevels(levels: TalentLevel[]): SelectOption[] {
  return levels.map(it => ({value: it, text: `${it}`}));
}
