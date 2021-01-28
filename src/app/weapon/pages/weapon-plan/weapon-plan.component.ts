import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponPlanner} from '../../services/weapon-planner.service';
import {ActivatedRoute} from '@angular/router';
import {first, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MaterialType} from '../../../inventory/models/material-type.enum';
import {Observable} from 'rxjs';
import {ItemList} from '../../../inventory/models/item-list.model';
import {WeaponRequirementService} from '../../services/weapon-requirement.service';
import {ExecutePlanConfirmDialogComponent} from '../../../game-common/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {NGXLogger} from 'ngx-logger';
import {WeaponStats} from '../../models/weapon-stats.model';

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

  plan!: WeaponPlan;

  goalStats!: WeaponStats;

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private weapons: WeaponService, private planner: WeaponPlanner, private requirement: WeaponRequirementService,
              private route: ActivatedRoute, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.route.parent?.params
      .pipe(
        first(),
        switchMap(params => {
          const id = Number(params.id);
          return this.weapons.getPartyWeapon(id).pipe(switchMap(weapon => {
            this.logger.info('received weapon', weapon);
            this.party = weapon;
            return this.planner.getPlan(id).pipe(switchMap(plan => {
              this.logger.info('received weapon plan', plan);
              this.plan = plan;
              return this.weapons.getWeaponStats(weapon, plan.ascension, plan.level).pipe(
                tap(stats => this.goalStats = stats),
                switchMap(_ => this.requirement.getRequirements(id))
              );
            }));
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(requirements => {
        this.logger.info('received weapon requirements', requirements);
        return this.plans = requirements;
      });
  }

  saveParty(): void {
    this.weapons.updatePartyMember(this.party);
    this.weapons.getWeaponStats(this.party, this.party.ascension, this.party.level).subscribe(stats => {
      this.party.atk = stats.atk;
      this.party.subStat = stats.subStat;
    });
    this.logger.info('character saved', this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
    this.weapons.getWeaponStats(this.party, this.plan.ascension, this.plan.level).subscribe(stats => {
      this.goalStats = stats;
    });
    this.logger.info('plan saved', this.plan);
  }

  executePlan(planIndex: number): void {
    const plan = this.plans[planIndex];
    const data = {title: plan.text, cost: plan.value, item: this.i18n.dict(`weapons.${this.party.id}`)};
    this.executePlanConfirm.open(data).afterConfirm().subscribe(_ => {
      this.requirement.consumeMaterial(plan.value);
      this.executeLevelup();
      this.logger.info('executed all plan');
      this.saveParty();
    });
  }

  private executeLevelup(): void {
    this.party.ascension = this.plan.ascension;
    this.party.level = this.plan.level;
  }
}
