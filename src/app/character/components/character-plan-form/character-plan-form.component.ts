import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterOverview} from '../../models/character.model';
import {
  allConstellations,
  CharacterProgress,
  Constellation,
} from '../../models/character-progress.model';
import {TalentInfoService} from '../../services/talent-info.service';
import {TalentLevel} from '../../models/talent-info.model';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {CharacterPlan} from '../../models/character-plan.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {CharacterInfo} from '../../models/character-info.model';

@Component({
  selector: 'app-character-plan-form',
  templateUrl: './character-plan-form.component.html',
  styleUrls: ['./character-plan-form.component.scss'],
})
export class CharacterPlanFormComponent implements OnInit {
  i18n = new I18n('game-common');

  @Input()
  character!: CharacterOverview;

  info!: CharacterInfo;

  progress!: CharacterProgress;

  plan!: CharacterPlan;

  @Input()
  reachedStates: boolean[] = [];

  constellations!: SelectOption[];

  talentLevels: {[id: number]: SelectOption[]} = {};

  goalTalentLevels: {[id: number]: SelectOption[]} = {};

  @Output()
  changed = new EventEmitter();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(
    public service: CharacterService,
    public talents: TalentInfoService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.logger.info('init with character', this.character);
    this.info = this.character.info;
    this.progress = this.character.progress;
    this.plan = this.character.plan;
    this.constellations = allConstellations.map(it => {
      const key = it === 0 ? 'none' : `constellations.${this.info.id}.${it}`;
      return {
        value: it,
        text: `${it} - ${this.translator.instant(this.i18n.dict(key))}`,
      };
    });
    this.updateTalentLevels();
    this.updateGoalTalentLevels();
  }

  setConstellation(constellation: Constellation): void {
    const progress = this.progress;
    this.logger.info(`change constellation to ${constellation}`);
    progress.constellation = constellation;
    this.emitChange();
  }

  setCurrentLevel({ascension, level}: AscensionLevel): void {
    const progress = this.progress;
    this.logger.info(`change ascension-level to (${ascension}, ${level})`);
    progress.ascension = ascension;
    progress.level = level;
    this.talents.correctLevels(progress.talents, ascension);
    this.updateTalentLevels();
    this.updateStats();
  }

  setGoalLevel({ascension, level}: AscensionLevel): void {
    const plan = this.plan;
    this.logger.info(`change plan ascension-level to (${ascension}, ${level})`);
    plan.ascension = ascension;
    plan.level = level;
    this.correctGoalTalents();
    this.updateStats();
  }

  setTalent(id: number, level: number): void {
    const progress = this.progress;
    this.logger.info(`change talent level to ${level}`);
    progress.talents[id] = this.talents.correctLevel(progress.ascension, level);
    this.correctGoalTalents();
    this.emitChange();
  }

  setGoalTalent(id: number, level: number): void {
    const plan = this.plan;
    this.logger.info(`change plan talent level to ${level}`);
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
      const levels = this.talents.levels(
        this.plan.ascension,
        this.progress.talents[talent] ?? 1,
      );
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
    this.service.getOverview(this.character).subscribe(character => {
      this.character = character;
      this.emitChange();
    });
  }
}

function mapTalentLevels(levels: TalentLevel[]): SelectOption[] {
  return levels.map(it => ({value: it, text: `${it}`}));
}
