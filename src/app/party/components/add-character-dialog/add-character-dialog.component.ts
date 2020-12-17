import {Component, OnInit, ViewChild} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {AscensionLevelSelectComponent} from '../../../shared/components/ascension-level-select/ascension-level-select.component';
import {Level} from '../../../shared/models/level';
import {CharacterService} from '../../../shared/services/character.service';
import {Constellation} from '../../../shared/models/constellation';
import {TalentLevel} from '../../../shared/models/talent-level';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';

@Component({
  selector: 'app-character-select-dialog',
  templateUrl: './add-character-dialog.component.html',
  styleUrls: ['./add-character-dialog.component.sass'],
  animations: addItemDialogAnimation
})
export class AddCharacterDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  characters: Character[] = [];

  selected: Character | undefined;

  @ViewChild('ascension')
  ascensionLevel!: AscensionLevelSelectComponent;

  level!: Level;

  constellationLevels: Constellation[] = [0, 1, 2, 3, 4, 5, 6];

  constellation: Constellation = 0;

  talentLevels: TalentLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  talents: { value: TalentLevel }[] = [{value: 1}, {value: 1}, {value: 1}];

  constructor(private service: CharacterService, private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.service.nonParty.subscribe(res => this.characters = res);
  }

  select(character: Character): void {
    this.selected = character;
  }

  setLevel(level: Level): void {
    this.level = level;
  }

  reset(): void {
    this.selected = undefined;
    this.ascensionLevel.reset();
    this.constellation = 0;
    this.talents.forEach(i => i.value = 1);
  }

  add(): void {
    if (this.selected && this.level) {
      this.service.addPartyMember(this.selected.id, this.level, this.constellation, this.talents.map(i => i.value));
      this.translator.get(this.i18nDict('characters.' + this.selected.id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
