import {Component, OnInit} from '@angular/core';
import {Character} from 'src/app/character/models/character.model';
import {I18n} from '../../../shared/models/i18n.model';
import {CharacterService} from 'src/app/character/services/character.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {switchMap, takeUntil} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {TalentLevelData} from 'src/app/character/models/talent-level-data.model';
import {TalentLevel} from '../../../character/models/talent-level.type';
import {TalentService} from 'src/app/character/services/talent.service';
import {CharacterPlanner} from 'src/app/plan/services/character-planner.service';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-character-select-dialog',
  templateUrl: './add-character-dialog.component.html',
  styleUrls: ['./add-character-dialog.component.scss'],
  animations: addItemDialogAnimation
})
export class AddCharacterDialogComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('characters');

  characters: Character[] = [];

  selected = false;

  selectedCharacter!: PartyCharacter;

  selectedPlan!: CharacterPlan;

  constructor(private characterService: CharacterService, public talentService: TalentService, private planner: CharacterPlanner,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.characterService.nonParty
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.characters = res);
  }

  select(character: Character): void {
    this.selected = true;
    const talents = this.talentService.getTalentsOfCharacter(character.id)
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
      this.translator.get(this.i18n.dict(`characters.${(this.selectedCharacter.id)}`))
        .pipe(switchMap(name => this.translator.get(this.i18n.module('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
