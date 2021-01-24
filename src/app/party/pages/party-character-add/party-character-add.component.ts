import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Location} from '@angular/common';
import {Character} from '../../../character/models/character.model';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {CharacterService} from '../../../character/services/character.service';
import {TalentService} from '../../../character/services/talent.service';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {takeUntil} from 'rxjs/operators';
import {TalentLevel} from '../../../character/models/talent-level.type';
import {TalentLevelData} from '../../../character/models/talent-level-data.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-party-character-add',
  templateUrl: './party-character-add.component.html',
  styleUrls: ['./party-character-add.component.scss']
})
export class PartyCharacterAddComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('characters');

  characters: Character[] = [];

  selected = false;

  selectedCharacter!: PartyCharacter;

  selectedPlan!: CharacterPlan;

  constructor(private characterService: CharacterService, public talentService: TalentService, private planner: CharacterPlanner,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.characterService.nonParty
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.characters = res);
  }

  goBack(): void {
    this.location.back();
  }

  select(character: Character): void {
    this.selected = true;
    const talents = this.talentService.getTalents(character.skills)
      .filter(it => it.level)
      .map(it => ({id: it.id, level: 1 as TalentLevel}));
    this.selectedCharacter = {...character, constellation: 0, ascension: 0, level: 1, talents: this.copyTalents(talents)};
    this.selectedPlan = {id: character.id, ascension: 0, level: 1, talents: this.copyTalents(talents)};
  }

  copyTalents(talents: TalentLevelData[]): TalentLevelData[] {
    return JSON.parse(JSON.stringify(talents));
  }

  reset(): void {
    this.selected = false;
  }

  add(): void {
    if (this.selected) {
      this.characterService.addPartyMember(this.selectedCharacter);
      this.planner.updatePlan(this.selectedPlan);
      this.reset();
    }
  }

}
