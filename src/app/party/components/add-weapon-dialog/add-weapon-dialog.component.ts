import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {Weapon} from 'src/app/weapon/models/weapon.model';
import {WeaponService} from 'src/app/weapon/services/weapon.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {WeaponPlanner} from 'src/app/plan/services/weapon-planner.service';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-add-weapon-dialog',
  templateUrl: './add-weapon-dialog.component.html',
  styleUrls: ['./add-weapon-dialog.component.scss'],
  animations: addItemDialogAnimation
})
export class AddWeaponDialogComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('weapons');

  weapons: Weapon[] = [];

  selected = false;

  selectedWeapon!: PartyWeapon;

  selectedPlan!: WeaponPlan;

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.weaponService.weapons
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.weapons = res);
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
      const id = this.selectedWeapon.id;
      this.weaponService.addPartyMember(this.selectedWeapon).subscribe(key => {
        this.selectedPlan.id = key;
        this.planner.updatePlan(this.selectedPlan);
      });
      this.translator.get(this.i18n.dict('weapons.' + id))
        .pipe(mergeMap(name => this.translator.get(this.i18n.module('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
