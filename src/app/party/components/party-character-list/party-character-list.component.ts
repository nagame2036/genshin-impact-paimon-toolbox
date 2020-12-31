import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Character} from '../../../character-and-gear/models/character.model';
import {PartyCharacter} from '../../../character-and-gear/models/party-character.model';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {Constellation} from '../../../character-and-gear/models/constellation.type';
import {TalentLevel} from '../../../character-and-gear/models/talent-level.type';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterService} from '../../../character-and-gear/services/character.service';
import {CharacterListComponent} from '../../../character-and-gear/components/character-list/character-list.component';
import {CharacterPlanDetail} from '../../../plan/models/character-plan-detail.model';
import {first, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-party-character-list',
  templateUrl: './party-character-list.component.html',
  styleUrls: ['./party-character-list.component.sass']
})
export class PartyCharacterListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.characters';

  characters: Character[] = [];

  plans = new Map<number, CharacterPlanDetail>();

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @Output()
  create = new EventEmitter();

  @ViewChild('list')
  list!: CharacterListComponent;

  constructor(private characterService: CharacterService, private planner: CharacterPlanner) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.characterService.party, this.planner.activePlans])
      .pipe(
        map(it => it[0]),
        tap(party => this.characters = party),
        switchMap(party => party),
        mergeMap(character => this.planner.getPlan(character.id).pipe(first())),
      )
      .subscribe(res => this.plans.set(res.id, this.planner.getPlanDetail(res)));
  }

  getConstellation(item: Character): Constellation {
    return (item as PartyCharacter)?.constellation ?? 0;
  }

  getAscension(item: Character): Ascension {
    return (item as PartyCharacter)?.ascension ?? Ascension.ZERO;
  }

  getGoalAscension(item: Character): Ascension {
    return this.plans.get(item.id)?.ascension ?? Ascension.ZERO;
  }

  getLevel(item: Character): number {
    return (item as PartyCharacter)?.level ?? 1;
  }

  getGoalLevel(item: Character): number {
    return this.plans.get(item.id)?.level ?? 1;
  }

  getTalents(item: Character): TalentLevel[] {
    return (item as PartyCharacter)?.talents.map(it => it.level) ?? [1, 1, 1];
  }

  getGoalTalent(item: Character, num: number): TalentLevel {
    return this.plans.get(item.id)?.talents[num].level ?? 1;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
