import {Component, OnInit, ViewChild} from '@angular/core';
import {Character} from 'src/app/character-and-gear/models/character.model';
import {AbstractTranslateComponent} from 'src/app/shared/components/abstract-translate.component';
import {AscensionLevelSelectComponent} from 'src/app/character-and-gear/components/ascension-level-select/ascension-level-select.component';
import {AscensionLevel} from 'src/app/character-and-gear/models/ascension-level.model';
import {CharacterService} from 'src/app/character-and-gear/services/character.service';
import {Constellation} from 'src/app/character-and-gear/models/constellation.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {mergeMap} from 'rxjs/operators';
import {addItemDialogAnimation} from '../../animations/add-item-dialog.animation';
import {TalentLevelData} from 'src/app/character-and-gear/models/talent-level-data.model';
import {TalentService} from 'src/app/character-and-gear/services/talent.service';
import {rangeList} from 'src/app/shared/utils/range-list';
import {Ascension} from 'src/app/character-and-gear/models/ascension.enum';
import {CharacterPlanner} from 'src/app/plan/services/character-planner.service';

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

  constellationLevels: Constellation[] = rangeList(0, 6) as Constellation[];

  constellation: Constellation = 0;

  @ViewChild('ascensionLevel')
  ascensionLevel!: AscensionLevelSelectComponent;

  level = new AscensionLevel();

  talentsData: TalentLevelData[] = [];

  constructor(private characterService: CharacterService, public talentService: TalentService, private planner: CharacterPlanner,
              private snake: MatSnackBar, private translator: TranslateService) {
    super();
  }

  get ascension(): Ascension {
    return this.level?.ascension ?? Ascension.ZERO;
  }

  ngOnInit(): void {
    this.characterService.nonParty.subscribe(res => this.characters = res);
  }

  getConstellationText(constellation: Constellation): string {
    const text = constellation === 0 ? 'none' : `constellations.${this.selected?.id}.${constellation}`;
    return this.i18nDict(text);
  }

  select(character: Character): void {
    this.talentService.getTalentsOfCharacter(character.id).subscribe(res => {
      this.talentsData = res.filter(it => it.level).map(it => ({id: it.id, level: 1}));
    });
    this.selected = character;
  }

  setLevel(level: AscensionLevel): void {
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
      const id = this.selected.id;
      this.characterService.addPartyMember(id, this.level, this.constellation, this.talentsData);
      this.planner.updatePlan(id, this.level.ascension, this.level.level, this.talentsData);
      this.translator.get(this.i18nDict(`characters.${id}`))
        .pipe(mergeMap(name => this.translator.get(this.i18n('add-success'), {name})))
        .subscribe(res => this.snake.open(res.toString(), undefined, {duration: 2000}));
      this.reset();
    }
  }
}
