import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Weapon} from '../../../shared/models/weapon';
import {animate, style, transition, trigger} from '@angular/animations';
import {Level} from '../../../shared/models/level';
import {AscensionLevelSelectComponent} from '../../../shared/components/ascension-level-select/ascension-level-select.component';
import {WeaponService} from '../../../shared/services/weapon.service';
import {RefineRank} from '../../../shared/models/refine-rank';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-add-weapon-dialog',
  templateUrl: './add-weapon-dialog.component.html',
  styleUrls: ['./add-weapon-dialog.component.sass'],
  animations: [
    trigger('listTrigger', [
      transition(':leave', [
        animate('400ms ease-in', style({transform: 'translate(-100%, -120%)'})),
      ]),
      transition(':enter', [
        style({transform: 'translate(-100%, -120%)'}),
        animate('400ms ease-out'), style({transform: 'translate(0, 0)'}),
      ])
    ]),
    trigger('formTrigger', [
      transition(':leave', [
        animate('500ms ease-in', style({opacity: 0}))
      ]),
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms ease-in', style({opacity: 1}))
      ])
    ])
  ]
})
export class AddWeaponDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  selected: Weapon | undefined;

  @ViewChild('ascension')
  ascensionLevel!: AscensionLevelSelectComponent;

  level!: Level;

  refineOptions: RefineRank[] = [1, 2, 3, 4, 5];

  refine: RefineRank = 1;

  constructor(private service: WeaponService, @Inject(MAT_DIALOG_DATA) public data: { party: boolean },
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
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
