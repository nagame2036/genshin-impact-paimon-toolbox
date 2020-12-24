import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractTranslateComponent} from 'src/app/shared/components/abstract-translate.component';
import {Weapon} from 'src/app/character-and-gear/models/weapon.model';
import {AscensionLevel} from 'src/app/character-and-gear/models/ascension-level.model';
import {AscensionLevelSelectComponent} from 'src/app/character-and-gear/components/ascension-level-select/ascension-level-select.component';
import {WeaponService} from 'src/app/character-and-gear/services/weapon.service';
import {RefineRank} from 'src/app/character-and-gear/models/refine-rank.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {WeaponPlanner} from 'src/app/plan/services/weapon-planner.service';

@Component({
  selector: 'app-add-weapon-dialog',
  templateUrl: './add-weapon-dialog.component.html',
  styleUrls: ['./add-weapon-dialog.component.sass'],
  animations: addItemDialogAnimation
})
export class AddWeaponDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapons';

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
      this.service.addPartyMember(id, this.level, this.refine).subscribe(key => {
        this.planner.updatePlan(key, this.level.ascension, this.level.level);
      });
      this.translator.get(this.i18nDict('weapons.' + id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
