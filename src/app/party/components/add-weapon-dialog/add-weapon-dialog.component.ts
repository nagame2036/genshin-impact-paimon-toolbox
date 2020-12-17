import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {Weapon} from '../../../shared/models/weapon';
import {Level} from '../../../shared/models/level';
import {AscensionLevelSelectComponent} from '../../../shared/components/ascension-level-select/ascension-level-select.component';
import {WeaponService} from '../../../shared/services/weapon.service';
import {RefineRank} from '../../../shared/models/refine-rank';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';

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

  @ViewChild('ascension')
  ascensionLevel!: AscensionLevelSelectComponent;

  level!: Level;

  refineOptions: RefineRank[] = [1, 2, 3, 4, 5];

  refine: RefineRank = 1;

  constructor(private service: WeaponService, private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.service.weapons.subscribe(res => this.weapons = res);
  }

  select(weapon: Weapon): void {
    this.selected = weapon;
  }

  setLevel(level: Level): void {
    this.level = level;
  }

  reset(): void {
    this.selected = undefined;
    this.ascensionLevel.reset();
    this.refine = 1;
  }

  add(): void {
    if (this.selected && this.level) {
      this.service.addPartyMember(this.selected.id, this.level, this.refine);
      this.translator.get(this.i18nDict('weapons.' + this.selected.id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
