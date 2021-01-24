import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Weapon} from 'src/app/weapon/models/weapon.model';
import {WeaponService} from 'src/app/weapon/services/weapon.service';
import {takeUntil} from 'rxjs/operators';
import {WeaponPlanner} from 'src/app/plan/services/weapon-planner.service';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-party-weapon-add',
  templateUrl: './party-weapon-add.component.html',
  styleUrls: ['./party-weapon-add.component.scss']
})
export class PartyWeaponAddComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('weapons');

  weapons: Weapon[] = [];

  selected = false;

  selectedWeapon!: PartyWeapon;

  selectedPlan!: WeaponPlan;

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner, private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.weaponService.weapons
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.weapons = res);
  }

  goBack(): void {
    this.location.back();
  }

  select(weapon: Weapon): void {
    this.selected = true;
    this.selectedWeapon = {...weapon, refine: 1, ascension: 0, level: 1};
    this.selectedPlan = {id: weapon.id, ascension: 0, level: 1};
  }

  reset(): void {
    this.selected = false;
  }

  add(): void {
    if (this.selected) {
      this.weaponService.addPartyMember(this.selectedWeapon).subscribe(key => {
        this.selectedPlan.id = key;
        this.planner.updatePlan(this.selectedPlan);
      });
      this.reset();
    }
  }
}
