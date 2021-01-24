import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
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
import {AscensionLevel} from '../../../game-common/models/ascension-level.model';
import {combineLatest, from, Observable, range, ReplaySubject, Subject, zip} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {PartyPlanExecutor} from '../../services/party-plan-executor.service';
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
    [MaterialType.ENEMY_MOB],
  ];

  readonly subtitles = [
    'common',
    'boss',
    '1/4/7',
    '2/5/7',
    '3/6/7',
    'enemy',
  ];

  party!: PartyCharacter;

  readonly #party = new ReplaySubject<PartyCharacter>();

  plan!: CharacterPlan;

  readonly #plan = new ReplaySubject<CharacterPlan>();

  plans: { text: string, value: ItemList, satisfied: Observable<boolean> }[] = [
    {text: this.i18n.module('total-cost'), value: new ItemList(), satisfied: new Subject()},
    {text: this.i18n.module('levelup-cost'), value: new ItemList(), satisfied: new Subject()},
    {text: this.i18n.module('talent-cost.0'), value: new ItemList(), satisfied: new Subject()},
    {text: this.i18n.module('talent-cost.1'), value: new ItemList(), satisfied: new Subject()},
    {text: this.i18n.module('talent-cost.2'), value: new ItemList(), satisfied: new Subject()},
  ];

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private characters: CharacterService, private planner: CharacterPlanner, private route: ActivatedRoute,
              private levelup: CharacterLevelupCostService, private talentUp: TalentLevelupCostService,
              private characterExps: CharacterExpMaterialService, private executor: PartyPlanExecutor) {
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

  executePlanAndSave(planIndex: number): void {
    const plan = this.plans[planIndex];
    const data = {title: plan.text, cost: plan.value, item: this.i18n.dict(`characters.${this.party.id}`)};
    this.executePlanConfirm.open(data).afterConfirm().subscribe(_ => {
      this.executePlan(plan, planIndex);
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
    plan.value = cost;
    plan.satisfied = this.executor.checkDemandSatisfied(cost);
  }

  private executePlan(plan: { text: string; value: ItemList; satisfied: Observable<boolean> }, planIndex: number): void {
    this.executor.consumeDemand(plan.value);
    switch (planIndex) {
      case 0:
        this.executeAll();
        break;
      case 1:
        this.executeLevelup();
        break;
      default:
        this.executeTalentLevelup(planIndex - 2);
        break;
    }
    this.saveParty();
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
