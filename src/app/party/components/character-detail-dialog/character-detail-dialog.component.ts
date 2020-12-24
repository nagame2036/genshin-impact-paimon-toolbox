import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CharacterService} from '../../../character-and-gear/services/character.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {PartyCharacter} from '../../../character-and-gear/models/party-character.model';
import {TalentLevelData} from '../../../character-and-gear/models/talent-level-data.model';
import {TalentService} from '../../../character-and-gear/services/talent.service';
import {Constellation} from '../../../character-and-gear/models/constellation.type';
import {TalentLevel} from '../../../character-and-gear/models/talent-level.type';
import {rangeList} from '../../../shared/utils/range-list';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {toAscensionLevel} from '../../../plan/models/levelup-plan.model';

@Component({
  selector: 'app-character-detail-dialog',
  templateUrl: './character-detail-dialog.component.html',
  styleUrls: ['./character-detail-dialog.component.sass']
})
export class CharacterDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.characters';

  constellations = rangeList(0, 6) as Constellation[];

  constellation: Constellation;

  ascension: Ascension;

  targetAscension = Ascension.ZERO;

  level: number;

  targetLevel: number;

  talentLevels: TalentLevel[];

  talents: TalentLevelData[];

  targetTalentLevels: TalentLevel[][];

  targetTalents: TalentLevelData[];

  constructor(public dialogRef: MatDialogRef<CharacterDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { character: PartyCharacter, plan: CharacterPlan },
              private characterService: CharacterService, public talentService: TalentService, private planner: CharacterPlanner) {
    super();
    const {character: character, plan: plan} = this.data;
    this.constellation = character.constellation;
    this.ascension = character.ascension;
    this.level = character.level;
    this.talents = character.talents;
    this.talentLevels = this.talentService.levels(this.ascension);
    const {ascension: ascension, level: level} = toAscensionLevel(plan.levelup);
    this.targetAscension = ascension;
    this.targetLevel = level;
    this.targetTalentLevels = this.talents.map(it => talentService.levels(this.targetAscension, it.level));
    this.targetTalents = plan.talents;
  }

  ngOnInit(): void {
  }

  getConstellationText(constellation: Constellation): string {
    const text = constellation === 0 ? 'none' : `constellations.${this.data.character.id}.${constellation}`;
    return this.i18nDict(text);
  }

  talentLabel(talent: TalentLevelData): string {
    return this.i18nDict('talent-labels.' + talent.id % 10);
  }

  talentName(talent: TalentLevelData): string {
    return this.i18nDict('talents.' + talent.id);
  }

  setConstellation(constellation: Constellation): void {
    this.constellation = constellation;
    this.save();
  }

  setLevel(event: { current: AscensionLevel; target: AscensionLevel }): void {
    this.ascension = event.current.ascension;
    this.level = event.current.level;
    this.targetAscension = event.target.ascension;
    this.targetLevel = event.target.level;
    this.talentLevels = this.talentService.levels(this.ascension);
    this.talents = this.talentService.correctLevels(this.ascension, this.talents);
    this.correctTargetTalents();
    this.save();
  }

  setTalent(num: number, value: number): void {
    this.talents[num].level = this.talentService.correctLevel(this.ascension, value);
    this.correctTargetTalents();
    this.save();
  }

  correctTargetTalents(): void {
    this.targetTalentLevels = this.talents.map(it => this.talentService.levels(this.targetAscension, it.level));
    const starts = this.talents.map(it => it.level);
    this.targetTalents = this.talentService.correctLevels(this.targetAscension, this.targetTalents, starts);
  }

  setTargetTalent(num: number, value: number): void {
    this.targetTalents[num].level = this.talentService.correctLevel(this.targetAscension, value);
    this.save();
  }

  save(): void {
    this.characterService.updatePartyMember({
      ...this.data.character,
      ascension: this.ascension,
      level: this.level,
      constellation: this.constellation,
      talents: this.talents
    });
    this.planner.updatePlan(this.data.plan.id, this.targetAscension, this.targetLevel, this.targetTalents);
  }

  remove(id: number): void {
    this.characterService.removePartyMember(id);
    this.dialogRef.close();
  }
}
