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
import {combineLatest, from, Observable, range, ReplaySubject, Subject, zip} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {PartyPlanExecutor} from '../../services/party-plan-executor.service';
import {MatDialog} from '@angular/material/dialog';
import {ExecutePlanConfirmDialogComponent} from '../../components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';

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

  plans: { title: string, cost: ItemList, satisfied: Observable<boolean> }[] = [
    {title: this.i18n.module('total-cost'), cost: new ItemList(), satisfied: new Subject()},
    {title: this.i18n.module('levelup-cost'), cost: new ItemList(), satisfied: new Subject()},
    {title: this.i18n.module('talent-cost.0'), cost: new ItemList(), satisfied: new Subject()},
    {title: this.i18n.module('talent-cost.1'), cost: new ItemList(), satisfied: new Subject()},
    {title: this.i18n.module('talent-cost.2'), cost: new ItemList(), satisfied: new Subject()},
  ];

  planExecution = [
    this.executeAll,
    this.executeLevelup,
  ];

  constructor(private characters: CharacterService, private planner: CharacterPlanner, private route: ActivatedRoute,
              private levelup: CharacterLevelupCostService, private talentUp: TalentLevelupCostService,
              private characterExps: CharacterExpMaterialService, private executor: PartyPlanExecutor, private dialog: MatDialog) {
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

  executePlan(planIndex: number): void {
    const plan = this.plans[planIndex];
    const execution = this.planExecution[planIndex] ?? (() => this.executeTalentLevelup(planIndex - 2));
    const data = {title: plan.title, cost: plan.cost, item: this.i18n.dict(`characters.${this.party.id}`)};
    ExecutePlanConfirmDialogComponent.openBy(this.dialog, data, () => {
      this.executor.consumeDemand(plan.cost);
      execution();
      this.saveParty();
    });
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
          tap(cost => this.updatePlanDetail(1, cost)),
          switchMap(levelup => {
            return this.talentUp.cost(party, talents)
              .pipe(map(talentsUp => new ItemList().combine(levelup).combine(talentsUp)));
          })
        );
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => this.updatePlanDetail(0, total));
  }

  private updateTalentsCost(): void {
    combineLatest([this.#party, this.#plan])
      .pipe(switchMap(([party, {talents}]) => {
        return zip(from(talents), range(0, 100)).pipe(
          switchMap(([talent, index]) => {
            return this.talentUp.cost(party, [talent])
              .pipe(tap(cost => this.updatePlanDetail(2 + index, cost)));
          })
        );
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private updatePlanDetail(planIndex: number, cost: ItemList): void {
    const plan = this.plans[planIndex];
    plan.cost = cost;
    plan.satisfied = this.executor.checkDemandSatisfied(cost);
  }

  private executeAll(): void {
    this.executeLevelup();
    const talentsLength = this.plans.length - 2;
    for (let i = 0; i < talentsLength; i++) {
      this.executeTalentLevelup(i);
    }
  }

  private executeLevelup(): void {
    this.party.ascension = this.plan.ascension;
    this.party.level = this.plan.level;
  }

  private executeTalentLevelup(index: number): void {
    this.party.talents[index].level = this.plan.talents[index].level;
  }
}
