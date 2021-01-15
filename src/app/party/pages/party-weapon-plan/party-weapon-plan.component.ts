import {Component, OnInit} from '@angular/core';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {ActivatedRoute} from '@angular/router';
import {first, switchMap, takeUntil} from 'rxjs/operators';
import {MaterialType} from '../../../material/models/material-type.enum';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {ItemList} from '../../../material/models/item-list.model';
import {WeaponLevelupCostService} from '../../../plan/services/weapon-levelup-cost.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {PartyPlanExecutor} from '../../services/party-plan-executor.service';
import {ExecutePlanConfirmDialogComponent} from '../../components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-party-weapon-plan',
  templateUrl: './party-weapon-plan.component.html',
  styleUrls: ['./party-weapon-plan.component.scss']
})
export class PartyWeaponPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('party');

  readonly types = [
    [MaterialType.CURRENCY, MaterialType.WEAPON_EXP],
    [MaterialType.WEAPON_14],
    [MaterialType.WEAPON_25],
    [MaterialType.WEAPON_36],
    [MaterialType.ENEMY_ELITE, MaterialType.ENEMY_MOB],
  ];

  readonly subtitles = [
    'common',
    '1/4/7',
    '2/5/7',
    '3/6/7',
    'enemy',
  ];

  plans: { cost: ItemList; title: string; satisfied: Observable<boolean> }[] = [
    {title: this.i18n.module('total-cost'), cost: new ItemList(), satisfied: new Subject()},
  ];

  party!: PartyWeapon;

  readonly #party = new ReplaySubject<PartyWeapon>(1);

  plan!: WeaponPlan;

  readonly #plan = new ReplaySubject<WeaponPlan>(1);

  constructor(private weapons: WeaponService, private planner: WeaponPlanner, private route: ActivatedRoute,
              private levelup: WeaponLevelupCostService, private weaponExps: WeaponExpMaterialService,
              private executor: PartyPlanExecutor, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.updateTotalCost();
  }

  saveParty(): void {
    this.weapons.updatePartyMember(this.party);
    this.#party.next(this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
    this.#plan.next(this.plan);
  }

  executePlan(planIndex: number): void {
    const plan = this.plans[planIndex];
    const data = {title: plan.title, cost: plan.cost, item: this.i18n.dict(`weapons.${this.party.id}`)};
    ExecutePlanConfirmDialogComponent.openBy(this.dialog, data, () => {
      this.executor.consumeDemand(plan.cost);
      this.executeLevelup();
      this.saveParty();
    });
  }

  private init(): void {
    this.route.parent?.params
      .pipe(first())
      .pipe(switchMap(params => {
        const id = Number(params.id);
        return this.weapons.getPartyWeapon(id).pipe(switchMap(weapon => {
          this.party = weapon;
          this.#party.next(this.party);
          return this.planner.getPlan(id);
        }));
      }))
      .subscribe(plan => {
        this.plan = plan;
        this.#plan.next(this.plan);
      });
  }

  private updateTotalCost(): void {
    combineLatest([this.#party, this.#plan])
      .pipe(switchMap(([party, {ascension, level}]) => this.levelup.cost(party, new AscensionLevel(ascension, level))))
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => this.updateCostDetail(0, total));
  }

  private updateCostDetail(index: number, cost: ItemList): void {
    const detail = this.plans[index];
    detail.cost = cost;
    detail.satisfied = this.executor.checkDemandSatisfied(cost);
  }

  private executeLevelup(): void {
    this.party.ascension = this.plan.ascension;
    this.party.level = this.plan.level;
  }
}
