import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {rangeList} from '../../../shared/utils/range-list';
import {Constellation} from '../../../character/models/constellation.type';
import {TalentLevel} from '../../../character/models/talent-level.type';
import {TalentLevelData} from '../../../character/models/talent-level-data.model';
import {TalentService} from '../../../character/services/talent.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-character-plan-form',
  templateUrl: './character-plan-form.component.html',
  styleUrls: ['./character-plan-form.component.scss']
})
export class CharacterPlanFormComponent implements OnInit {

  i18n = new I18n('party');

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

  constellations = rangeList(0, 6) as Constellation[];

  talentLevels!: TalentLevel[];

  goalTalentLevels!: TalentLevel[][];

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter<CharacterPlan>();

  @Output()
  executePlan = new EventEmitter<number>();

  constructor(private talentService: TalentService) {
  }

  ngOnInit(): void {
    this.talentLevels = this.talentService.levels(this.character.ascension);
    this.goalTalentLevels = this.character.talents.map(it => this.talentService.levels(this.plan.ascension, it.level));
  }

  getConstellationText(constellation: Constellation): string {
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
    this.talentLevels = this.talentService.levels(ascension);
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
    this.goalTalentLevels = talents.map(it => this.talentService.levels(goalAscension, it.level));
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
    this.goalChange.emit(this.plan);
  }
}
