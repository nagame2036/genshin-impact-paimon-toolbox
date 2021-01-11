import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {CharacterService} from '../../../character/services/character.service';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {first, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ItemList} from '../../../material/models/item-list.model';
import {CharacterLevelupCostService} from '../../../plan/services/character-levelup-cost.service';
import {TalentLevelupCostService} from '../../../plan/services/talent-levelup-cost.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {combineLatest, from, range, ReplaySubject, zip} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';

@Component({
  selector: 'app-party-character-plan',
  templateUrl: './party-character-plan.component.html',
  styleUrls: ['./party-character-plan.component.scss']
})
export class PartyCharacterPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('party');

  readonly types = [
    [MaterialType.CURRENCY, MaterialType.LOCAL_SPECIALTY, MaterialType.CHARACTER_EXP],
    [MaterialType.TALENT_COMMON, MaterialType.CHARACTER_BOSS, MaterialType.CHARACTER_GEM],
    [MaterialType.TALENT_14],
    [MaterialType.TALENT_25],
    [MaterialType.TALENT_36],
    [MaterialType.COMMON_MOB],
  ];

  readonly subtitles = [
    'common',
    'boss',
    '1/4',
    '2/5',
    '3/6',
    'enemy',
  ];

  party!: PartyCharacter;

  readonly #party = new ReplaySubject<PartyCharacter>();

  plan!: CharacterPlan;

  readonly #plan = new ReplaySubject<CharacterPlan>();

  costs: { title: string, cost: ItemList }[] = [
    {title: this.i18n.module('total-cost'), cost: new ItemList()},
    {title: this.i18n.module('levelup-cost'), cost: new ItemList()},
    {title: this.i18n.module('talent-cost.0'), cost: new ItemList()},
    {title: this.i18n.module('talent-cost.1'), cost: new ItemList()},
    {title: this.i18n.module('talent-cost.2'), cost: new ItemList()},
  ];

  constructor(private characters: CharacterService, private planner: CharacterPlanner, private route: ActivatedRoute,
              private levelup: CharacterLevelupCostService, private talentUp: TalentLevelupCostService,
              private characterExps: CharacterExpMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.updateLevelUpAndTotalCost();
    this.updateTalentsCost();
  }

  saveParty(): void {
    this.characters.updatePartyMember(this.party);
    this.#party.next(this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
    this.#plan.next(this.plan);
  }

  private init(): void {
    this.route.parent?.params
      .pipe(first())
      .pipe(switchMap(params => {
        const id = Number(params.id);
        return this.characters.getPartyCharacter(id).pipe(switchMap(character => {
          this.party = character;
          this.#party.next(character);
          return this.planner.getPlan(id);
        }));
      }))
      .subscribe(plan => {
        this.plan = plan;
        this.#plan.next(plan);
      });
  }

  private updateLevelUpAndTotalCost(): void {
    combineLatest([this.#party, this.#plan])
      .pipe(switchMap(([party, {ascension, level, talents}]) => {
        return this.levelup.cost(party, new AscensionLevel(ascension, level)).pipe(
          map(it => this.characterExps.splitExpNeed(it)),
          tap(cost => this.costs[1].cost = cost),
          switchMap(levelup => {
            return this.talentUp.cost(party, talents)
              .pipe(map(talentsUp => new ItemList().combine(levelup).combine(talentsUp)));
          })
        );
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => this.costs[0].cost = total);
  }

  private updateTalentsCost(): void {
    combineLatest([this.#party, this.#plan])
      .pipe(switchMap(([party, {talents}]) => {
        return zip(from(talents), range(0, 100)).pipe(
          switchMap(([talent, index]) => {
            return this.talentUp.cost(party, [talent])
              .pipe(tap(cost => this.costs[2 + index].cost = cost));
          })
        );
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
