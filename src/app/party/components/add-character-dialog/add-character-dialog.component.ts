import {Component, OnInit, ViewChild} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {AscensionLevelSelectComponent} from '../../../shared/components/ascension-level-select/ascension-level-select.component';
import {Level} from '../../../shared/models/level';
import {CharacterService} from '../../../shared/services/character.service';
import {Constellation} from '../../../shared/models/constellation';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {TalentLevelData} from '../../../shared/models/talent-level-data.model';
import {TalentService} from '../../../shared/services/talent.service';
import {rangeList} from '../../../shared/utils/range-list';

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

  constellationLevels: Constellation[] = rangeList(0, 6) as Constellation[];

  constellation: Constellation = 0;

  talentsData: TalentLevelData[] = [];

  constructor(private characterService: CharacterService, public talentService: TalentService,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.characterService.nonParty.subscribe(res => this.characters = res);
  }

  select(character: Character): void {
    this.talentService.getTalentsOfCharacter(character.id).subscribe(res => {
      this.talentsData = res.filter(it => it.level).map(it => ({id: it.id, level: 1}));
    });
    this.selected = character;
  }

  setLevel(level: Level): void {
    this.level = level;
  }

  reset(): void {
    this.selected = undefined;
    this.ascensionLevel.reset();
    this.constellation = 0;
    this.talentsData = this.talentsData.map(it => ({id: it.id, level: 1}));
  }

  add(): void {
    if (this.selected && this.level) {
      this.characterService.addPartyMember(this.selected.id, this.level, this.constellation, this.talentsData);
      this.translator.get(this.i18nDict('characters.' + this.selected.id))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
