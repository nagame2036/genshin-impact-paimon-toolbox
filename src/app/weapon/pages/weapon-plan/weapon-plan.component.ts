import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponPlanner} from '../../services/weapon-planner.service';
import {ActivatedRoute} from '@angular/router';
import {first, switchMap, takeUntil} from 'rxjs/operators';
import {MaterialType} from '../../../inventory/models/material-type.enum';
import {Observable, ReplaySubject} from 'rxjs';
import {ItemList} from '../../../inventory/models/item-list.model';
import {WeaponRequirementService} from '../../services/weapon-requirement.service';
import {ExecutePlanConfirmDialogComponent} from '../../../game-common/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';

@Component({
  selector: 'app-weapon-plan',
  templateUrl: './weapon-plan.component.html',
  styleUrls: ['./weapon-plan.component.scss']
})
export class WeaponPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('game-common');

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

  plans!: { text: string; value: Observable<ItemList>; satisfied: Observable<boolean> }[];

  party!: PartyWeapon;

  readonly #party = new ReplaySubject<PartyWeapon>(1);

  plan!: WeaponPlan;

  readonly #plan = new ReplaySubject<WeaponPlan>(1);

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private weapons: WeaponService, private planner: WeaponPlanner, private requirement: WeaponRequirementService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.parent?.params
      .pipe(first())
      .pipe(switchMap(params => {
        const id = Number(params.id);
        return this.weapons.getPartyWeapon(id).pipe(switchMap(weapon => {
          this.party = weapon;
          return this.planner.getPlan(id).pipe(switchMap(plan => {
            this.plan = plan;
            return this.requirement.getRequirements(id);
          }));
        }));
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(requirements => this.plans = requirements);
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
    const data = {title: plan.text, cost: plan.value, item: this.i18n.dict(`weapons.${this.party.id}`)};
    this.executePlanConfirm.open(data).afterConfirm().subscribe(_ => {
      this.requirement.consumeMaterial(plan.value);
      this.executeLevelup();
      this.saveParty();
    });
  }

  private executeLevelup(): void {
    this.party.ascension = this.plan.ascension;
    this.party.level = this.plan.level;
  }
}
