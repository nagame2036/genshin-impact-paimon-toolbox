import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Character} from '../../models/character.model';
import {PartyCharacter} from '../../models/party-character.model';
import {I18n} from '../../../shared/models/i18n.model';
import {CharacterService} from '../../services/character.service';
import {CharacterListComponent} from '../character-list/character-list.component';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {first, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-party-character-list',
  templateUrl: './party-character-list.component.html',
  styleUrls: ['./party-character-list.component.scss']
})
export class PartyCharacterListComponent implements OnInit {

  i18n = new I18n('characters');

  characters: Character[] = [];

  plans = new Map<number, CharacterPlan>();

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @Output()
  create = new EventEmitter();

  @ViewChild('list')
  list!: CharacterListComponent;

  constructor(private characterService: CharacterService, private planner: CharacterPlanner) {
  }

  ngOnInit(): void {
    combineLatest([this.characterService.party, this.planner.activePlans])
      .pipe(
        map(it => it[0]),
        tap(party => this.characters = party),
        switchMap(party => party),
        mergeMap(character => this.planner.getPlan(character.id).pipe(first())),
      )
      .subscribe(plan => this.plans.set(plan.id, plan));
  }

  getParty(character: Character): PartyCharacter {
    return character as PartyCharacter;
  }

  getPlan(character: PartyCharacter): CharacterPlan | undefined {
    return this.plans.get(character.id);
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
