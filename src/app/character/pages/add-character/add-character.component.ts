import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Location} from '@angular/common';
import {Character} from '../../models/character.model';
import {PartyCharacter} from '../../models/party-character.model';
import {CharacterPlan} from '../../models/character-plan.model';
import {CharacterService} from '../../services/character.service';
import {TalentService} from '../../services/talent.service';
import {CharacterPlanner} from '../../services/character-planner.service';
import {takeUntil} from 'rxjs/operators';
import {TalentLevel} from '../../models/talent-level.type';
import {TalentLevelData} from '../../models/talent-level-data.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-add-character',
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.scss']
})
export class AddCharacterComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('characters');

  characters: Character[] = [];

  selected = false;

  selectedCharacter!: PartyCharacter;

  selectedPlan!: CharacterPlan;

  constructor(private characterService: CharacterService, public talentService: TalentService, private planner: CharacterPlanner,
              private location: Location, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.characterService.nonParty
      .pipe(takeUntil(this.destroy$))
      .subscribe(characters => {
        this.logger.info('received non-party characters', characters);
        this.characters = characters;
      });
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
    this.logger.info('select character', character);
  }

  copyTalents(talents: TalentLevelData[]): TalentLevelData[] {
    return JSON.parse(JSON.stringify(talents));
  }

  reset(): void {
    this.selected = false;
    this.logger.info('reset');
  }

  add(): void {
    if (this.selected) {
      this.characterService.addPartyMember(this.selectedCharacter);
      this.planner.updatePlan(this.selectedPlan);
      this.logger.info('added character', this.selectedCharacter);
      this.reset();
    }
  }

}
