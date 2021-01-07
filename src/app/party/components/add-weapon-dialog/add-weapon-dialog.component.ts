import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from 'src/app/shared/components/abstract-translate.component';
import {Weapon} from 'src/app/character-and-gear/models/weapon.model';
import {WeaponService} from 'src/app/character-and-gear/services/weapon.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {WeaponPlanner} from 'src/app/plan/services/weapon-planner.service';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {PartyWeapon} from '../../../character-and-gear/models/party-weapon.model';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';

@Component({
  selector: 'app-add-weapon-dialog',
  templateUrl: './add-weapon-dialog.component.html',
  styleUrls: ['./add-weapon-dialog.component.scss'],
  animations: addItemDialogAnimation
})
export class AddWeaponDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapons';

  weapons: Weapon[] = [];

  selected = false;

  selectedWeapon!: PartyWeapon;

  selectedPlan!: WeaponPlan;

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.weaponService.weapons.subscribe(res => this.weapons = res);
  }

  select(weapon: Weapon): void {
    this.selected = true;
    this.selectedWeapon = {...weapon, refine: 1, ascension: Ascension.ZERO, level: 1};
    this.selectedPlan = {id: weapon.id, ascension: Ascension.ZERO, level: 1};
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
      this.translator.get(this.i18nDict('weapons.' + id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
