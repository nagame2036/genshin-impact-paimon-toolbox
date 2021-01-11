import {Component, OnInit} from '@angular/core';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {ActivatedRoute} from '@angular/router';
import {first, map, switchMap, takeUntil} from 'rxjs/operators';
import {MaterialType} from '../../../material/models/material-type.enum';
import {combineLatest, ReplaySubject} from 'rxjs';
import {ItemList} from '../../../material/models/item-list.model';
import {WeaponLevelupCostService} from '../../../plan/services/weapon-levelup-cost.service';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';

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
    [MaterialType.COMMON_ELITE, MaterialType.COMMON_MOB],
  ];

  readonly subtitles = [
    'common',
    '1/4',
    '2/5',
    '3/6',
    'enemy',
  ];

  costs = [
    {title: this.i18n.module('total-cost'), cost: new ItemList()},
  ];

  party!: PartyWeapon;

  readonly #party = new ReplaySubject<PartyWeapon>(1);

  plan!: WeaponPlan;

  readonly #plan = new ReplaySubject<WeaponPlan>(1);

  constructor(private weapons: WeaponService, private planner: WeaponPlanner, private route: ActivatedRoute,
              private levelup: WeaponLevelupCostService, private weaponExps: WeaponExpMaterialService) {
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
      .pipe(switchMap(([party, {ascension, level}]) => {
        return this.levelup.cost(party, new AscensionLevel(ascension, level))
          .pipe(map(it => this.weaponExps.splitExpNeed(it)));
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => this.costs[0].cost = total);
  }
}
