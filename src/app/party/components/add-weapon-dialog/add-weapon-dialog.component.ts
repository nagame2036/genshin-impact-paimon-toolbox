import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {Weapon} from '../../../shared/models/weapon';
import {AscensionLevel} from '../../../shared/models/ascension-level.model';
import {AscensionLevelSelectComponent} from '../../../shared/components/ascension-level-select/ascension-level-select.component';
import {WeaponService} from '../../../shared/services/weapon.service';
import {RefineRank} from '../../../shared/models/refine-rank';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';

@Component({
  selector: 'app-add-weapon-dialog',
  templateUrl: './add-weapon-dialog.component.html',
  styleUrls: ['./add-weapon-dialog.component.sass'],
  animations: addItemDialogAnimation
})
export class AddWeaponDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  weapons: Weapon[] = [];

  selected: Weapon | undefined;

  refineOptions: RefineRank[] = [1, 2, 3, 4, 5];

  refine: RefineRank = 1;

  @ViewChild('ascension')
  ascensionLevel!: AscensionLevelSelectComponent;

  level = new AscensionLevel();

  constructor(private service: WeaponService, private planner: WeaponPlanner,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.service.weapons.subscribe(res => this.weapons = res);
  }

  select(weapon: Weapon): void {
    this.selected = weapon;
  }

  setLevel(level: AscensionLevel): void {
    this.level = level;
  }

  reset(): void {
    this.selected = undefined;
    this.ascensionLevel.reset();
    this.refine = 1;
  }

  add(): void {
    if (this.selected && this.level) {
      const id = this.selected.id;
      this.service.addPartyMember(id, this.level, this.refine);
      this.planner.updatePlan(id, this.level.ascension, this.level.level);
      this.translator.get(this.i18nDict('weapons.' + id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
