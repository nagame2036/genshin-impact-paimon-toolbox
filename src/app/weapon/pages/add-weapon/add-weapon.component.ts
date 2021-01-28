import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Weapon} from 'src/app/weapon/models/weapon.model';
import {WeaponService} from 'src/app/weapon/services/weapon.service';
import {takeUntil} from 'rxjs/operators';
import {WeaponPlanner} from 'src/app/weapon/services/weapon-planner.service';
import {PartyWeapon} from '../../models/party-weapon.model';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {Location} from '@angular/common';
import {NGXLogger} from 'ngx-logger';
import {WeaponStats} from '../../models/weapon-stats.model';

@Component({
  selector: 'app-add-weapon',
  templateUrl: './add-weapon.component.html',
  styleUrls: ['./add-weapon.component.scss']
})
export class AddWeaponComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('weapons');

  weapons: Weapon[] = [];

  selected = false;

  selectedWeapon!: PartyWeapon;

  selectedPlan!: WeaponPlan;

  goalStats!: WeaponStats;

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner, private location: Location, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.weaponService.weapons
      .pipe(takeUntil(this.destroy$))
      .subscribe(weapons => {
        this.logger.info('received non-party weapons', weapons);
        this.weapons = weapons;
      });
  }

  goBack(): void {
    this.location.back();
  }

  select(weapon: Weapon): void {
    this.selected = true;
    this.selectedWeapon = this.weaponService.createPartyWeapon(weapon);
    this.selectedPlan = {id: weapon.id, ascension: 0, level: 1};
    this.goalStats = {atk: this.selectedWeapon.atk, subStat: this.selectedWeapon.subStat};
    this.logger.info('select weapon', weapon);
  }

  updateStats(): void {
    const plan = this.selectedPlan;
    const weapon = this.selectedWeapon;
    this.weaponService.getWeaponStats(weapon, weapon.ascension, weapon.level).subscribe(stats => {
      weapon.atk = stats.atk;
      weapon.subStat = stats.subStat;
    });
    this.weaponService.getWeaponStats(weapon, plan.ascension, plan.level).subscribe(stats => {
      this.goalStats = stats;
    });
  }

  reset(): void {
    this.selected = false;
    this.logger.info('reset');
  }

  add(): void {
    if (this.selected) {
      this.weaponService.addPartyMember(this.selectedWeapon).subscribe(key => {
        this.selectedPlan.id = key;
        this.planner.updatePlan(this.selectedPlan);
        this.logger.info('added weapon', this.selectedWeapon);
      });
      this.reset();
    }
  }
}
