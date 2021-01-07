import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {PartyCharacter} from '../../../character-and-gear/models/party-character.model';
import {rangeList} from '../../../shared/utils/range-list';
import {Constellation} from '../../../character-and-gear/models/constellation.type';
import {TalentLevel} from '../../../character-and-gear/models/talent-level.type';
import {TalentLevelData} from '../../../character-and-gear/models/talent-level-data.model';
import {TalentService} from '../../../character-and-gear/services/talent.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {CharacterPlan} from '../../models/character-plan.model';

@Component({
  selector: 'app-character-plan-form',
  templateUrl: './character-plan-form.component.html',
  styleUrls: ['./character-plan-form.component.sass']
})
export class CharacterPlanFormComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party';

  @Input()
  character!: PartyCharacter;

  @Input()
  plan!: CharacterPlan;

  constellations = rangeList(0, 6) as Constellation[];

  talentLevels!: TalentLevel[];

  goalTalentLevels!: TalentLevel[][];

  @Output()
  currentChange = new EventEmitter();

  @Output()
  goalChange = new EventEmitter<CharacterPlan>();

  constructor(private talentService: TalentService) {
    super();
  }

  ngOnInit(): void {
    this.talentLevels = this.talentService.levels(this.character.ascension);
    this.goalTalentLevels = this.character.talents.map(it => this.talentService.levels(this.plan.ascension, it.level));
  }

  getConstellationText(constellation: Constellation): string {
    const text = constellation === 0 ? 'none' : `constellations.${this.character.id}.${constellation}`;
    return this.i18nDict(text);
  }

  talentLabel(talent: TalentLevelData): string {
    return this.i18nDict('talent-labels.' + talent.id % 10);
  }

  talentName(talent: TalentLevelData): string {
    return this.i18nDict('talents.' + talent.id);
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
