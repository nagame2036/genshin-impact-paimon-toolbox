import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CharacterService} from '../../../shared/services/character.service';
import {Level} from '../../../shared/models/level';
import {PartyCharacter} from '../../../shared/models/party-character';
import {TalentLevelData} from '../../../shared/models/talent-level-data.model';
import {TalentService} from '../../../shared/services/talent.service';
import {Constellation} from '../../../shared/models/constellation';
import {TalentLevel} from '../../../shared/models/talent-level';
import {coerceIn} from '../../../shared/utils/coerce';
import {rangeList} from '../../../shared/utils/range-list';
import {Ascension} from '../../../shared/models/ascension.enum';

@Component({
  selector: 'app-character-detail-dialog',
  templateUrl: './character-detail-dialog.component.html',
  styleUrls: ['./character-detail-dialog.component.sass']
})
export class CharacterDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  constellations = rangeList(0, 6) as Constellation[];

  constellation: Constellation = 0;

  ascension = Ascension.ZERO;

  targetAscension = Ascension.ZERO;

  level = 1;

  currentTalentMaxLevel = 1;

  availableTalentLevels: TalentLevel[] = [];

  targetAvailableTalentLevels: TalentLevel[] = [];

  talents: TalentLevelData[] = [];

  constructor(public dialogRef: MatDialogRef<CharacterDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: PartyCharacter,
              private characterService: CharacterService, public talentService: TalentService) {
    super();
  }

  get character(): PartyCharacter {
    return {...this.data, ascension: this.ascension, level: this.level, constellation: this.constellation, talents: this.talents};
  }

  ngOnInit(): void {
    // avoid NG0100: ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.constellation = this.data.constellation;
      this.ascension = this.data.ascension;
      this.targetAscension = this.ascension;
      this.level = this.data.level;
      this.talents = this.data.talents;
      this.update();
    }, 5);
  }

  update(): void {
    this.availableTalentLevels = this.talentService.availableTalentLevels(this.ascension);
    this.targetAvailableTalentLevels = this.talentService.availableTalentLevels(this.targetAscension);
    this.currentTalentMaxLevel = this.talentService.maxAvailableTalentLevel(this.ascension);
    this.talents.forEach(it => it.level = coerceIn(it.level, 1, this.currentTalentMaxLevel) as TalentLevel);
  }

  talentLabel(talent: TalentLevelData): string {
    return this.i18nDict('talent-labels.' + talent.id % 10);
  }

  talentName(talent: TalentLevelData): string {
    return this.i18nDict('talents.' + talent.id);
  }

  setConstellation(constellation: Constellation): void {
    this.constellation = constellation;
    this.characterService.updatePartyMember(this.character);
  }

  setLevel(event: { current: Level; target: Level }): void {
    this.ascension = event.current.ascension;
    this.level = event.current.level;
    this.targetAscension = event.target.ascension;
    this.update();
    this.characterService.updatePartyMember(this.character);
  }

  setTalent(num: number, event: { current: number; target: number }): void {
    this.talents[num].level = coerceIn(event.current, 1, this.currentTalentMaxLevel) as TalentLevel;
    this.characterService.updatePartyMember(this.character);
  }

  remove(id: number): void {
    this.characterService.removePartyMember(id);
    this.dialogRef.close();
  }
}
