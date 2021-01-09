import {Component, OnInit} from '@angular/core';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-party-weapon-plan',
  templateUrl: './party-weapon-plan.component.html',
  styleUrls: ['./party-weapon-plan.component.scss']
})
export class PartyWeaponPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('characters');

  party!: PartyWeapon;

  plan!: WeaponPlan;

  constructor(private weapons: WeaponService, private planner: WeaponPlanner, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.parent?.params
      .pipe(switchMap(params => {
        const id = Number(params.id);
        return this.weapons.getPartyWeapon(id).pipe(switchMap(weapon => {
          this.party = weapon;
          return this.planner.getPlan(id);
        }));
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(plan => this.plan = plan);
  }

  saveParty(): void {
    this.weapons.updatePartyMember(this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
  }

}
