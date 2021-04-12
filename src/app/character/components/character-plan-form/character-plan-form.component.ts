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
  i18n = I18n.create('game-common');

  @Input()
  character!: CharacterOverview;

  info!: CharacterInfo;

  progress!: CharacterProgress;

  plan!: CharacterPlan;

  @Input()
  reachedStates: boolean[] = [];

  constellations!: SelectOption[];

  currTalentLevels: {[id: number]: SelectOption[]} = {};

  planTalentLevels: {[id: number]: SelectOption[]} = {};

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
    const i18n = this.i18n;
    const id = this.info.id;
    this.constellations = allConstellations.map(value => {
      const key = value === 0 ? i18n.dict('none') : i18n.data('constellation', id, value);
      return {value, text: `${value} - ${this.translator.instant(key)}`};
    });
    this.updateCurrTalentLevels();
    this.updatePlanTalentLevels();
  }

  setConstellation(constellation: Constellation): void {
    const progress = this.progress;
    this.logger.info(`change constellation to ${constellation}`);
    progress.constellation = constellation;
    this.emitChange();
  }

  setCurrLevel({ascension, level}: AscensionLevel): void {
    const progress = this.progress;
    this.logger.info(`change ascension-level to (${ascension}, ${level})`);
    progress.ascension = ascension;
    progress.level = level;
    this.talents.correctLevels(progress.talents, ascension);
    this.updateCurrTalentLevels();
    this.updateStats();
  }

  setPlanLevel({ascension, level}: AscensionLevel): void {
    this.logger.info(`change plan ascension-level to (${ascension}, ${level})`);
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.correctPlanTalents();
    this.updateStats();
  }

  setCurrTalent(id: number, level: number): void {
    const progress = this.progress;
    this.logger.info(`change talent level to ${level}`);
    progress.talents[id] = this.talents.correctLevel(progress.ascension, level);
    this.correctPlanTalents();
    this.emitChange();
  }

  setPlanTalent(id: number, level: number): void {
    const plan = this.plan;
    this.logger.info(`change plan talent level to ${level}`);
    plan.talents[id] = this.talents.correctLevel(plan.ascension, level);
    this.emitChange();
  }

  private updateCurrTalentLevels(): void {
    for (const talent of this.info.talentsUpgradable) {
      const levels = this.talents.levels(this.progress.ascension);
      this.currTalentLevels[talent] = mapTalentLevels(levels);
    }
  }

  private updatePlanTalentLevels(): void {
    for (const talent of this.info.talentsUpgradable) {
      const levels = this.talents.levels(
        this.plan.ascension,
        this.progress.talents[talent] ?? 1,
      );
      this.planTalentLevels[talent] = mapTalentLevels(levels);
    }
  }

  private correctPlanTalents(): void {
    const talents = this.progress.talents;
    const {ascension, talents: goalTalents} = this.plan;
    this.talents.correctLevels(goalTalents, ascension, talents);
    this.updatePlanTalentLevels();
  }

  private updateStats(): void {
    this.character = this.service.getOverview(this.character);
    this.emitChange();
  }

  private emitChange(): void {
    this.logger.info('character changed');
    this.changed.emit();
  }
}

function mapTalentLevels(levels: TalentLevel[]): SelectOption[] {
  return levels.map(it => ({value: it, text: `${it}`}));
}
