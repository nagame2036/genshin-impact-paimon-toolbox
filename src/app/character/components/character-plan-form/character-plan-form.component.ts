import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyCharacter} from '../../models/party-character.model';
import {rangeList} from '../../../shared/utils/range-list';
import {Constellation} from '../../models/constellation.type';
import {TalentLevel} from '../../models/talent-level.type';
import {TalentLevelData} from '../../models/talent-level-data.model';
import {TalentService} from '../../services/talent.service';
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {CharacterPlan} from '../../models/character-plan.model';
import {Observable, Subject} from 'rxjs';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-character-plan-form',
  templateUrl: './character-plan-form.component.html',
  styleUrls: ['./character-plan-form.component.scss']
})
export class CharacterPlanFormComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  character!: PartyCharacter;

  @Input()
  plan!: CharacterPlan;

  @Input()
  plans: { satisfied: Observable<boolean> }[] = [
    {satisfied: new Subject()},
    {satisfied: new Subject()},
    {satisfied: new Subject()},
    {satisfied: new Subject()},
    {satisfied: new Subject()},
  ];

  constellations!: SelectOption[];

  talentLevels!: SelectOption[];

  goalTalentLevels!: SelectOption[][];

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(private talentService: TalentService, private translator: TranslateService) {
  }

  ngOnInit(): void {
    this.constellations = rangeList(0, 6).map(it => {
      return {value: it, text: `${it} - ${this.translator.instant(this.getConstellationText(it))}`};
    });
    this.talentLevels = mapTalentLevels(this.talentService.levels(this.character.ascension));
    this.goalTalentLevels = this.character.talents.map(it => mapTalentLevels(this.talentService.levels(this.plan.ascension, it.level)));
  }

  getConstellationText(constellation: number): string {
    const text = constellation === 0 ? 'none' : `constellations.${this.character.id}.${constellation}`;
    return this.i18n.dict(text);
  }

  talentLabel(talent: TalentLevelData): string {
    return this.i18n.dict(`talent-types.${talent.id % 10}`);
  }

  talentName(talent: TalentLevelData): string {
    return this.i18n.dict('talents.' + talent.id);
  }

  setConstellation(constellation: Constellation): void {
    this.character.constellation = constellation;
    this.emitCurrentChange();
  }

  setCurrentLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.character.ascension = ascension;
    this.character.level = level;
    this.talentLevels = mapTalentLevels(this.talentService.levels(ascension));
    this.character.talents = this.talentService.correctLevels(ascension, this.character.talents);
    this.emitCurrentChange();
  }

  setGoalLevel(ascensionLevel: AscensionLevel): void {
    const {ascension, level} = ascensionLevel;
    this.plan.ascension = ascension;
    this.plan.level = level;
    this.correctGoalTalents();
    this.emitGoalChange();
  }

  setTalent(num: number, level: number): void {
    this.character.talents[num].level = this.talentService.correctLevel(this.character.ascension, level);
    this.correctGoalTalents();
    this.emitCurrentChange();
  }

  correctGoalTalents(): void {
    const talents = this.character.talents;
    const goalAscension = this.plan.ascension;
    this.goalTalentLevels = talents.map(it => mapTalentLevels(this.talentService.levels(goalAscension, it.level)));
    const starts = talents.map(it => it.level);
    this.plan.talents = this.talentService.correctLevels(goalAscension, this.plan.talents, starts);
    this.emitGoalChange();
  }

  setGoalTalent(num: number, level: number): void {
    this.plan.talents[num].level = this.talentService.correctLevel(this.plan.ascension, level);
    this.emitGoalChange();
  }

  private emitCurrentChange(): void {
    this.currentChange.emit();
  }

  private emitGoalChange(): void {
    this.goalChange.emit();
  }
}

function mapTalentLevels(levels: TalentLevel[]): SelectOption[] {
  return levels.map(it => ({value: it, text: `${it}`}));
}
