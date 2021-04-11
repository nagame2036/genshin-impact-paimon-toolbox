import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Location} from '@angular/common';
import {CharacterOverview} from '../../models/character.model';
import {CharacterInfo} from '../../models/character-info.model';
import {CharacterService} from '../../services/character.service';
import {takeUntil} from 'rxjs/operators';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-add-character',
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.scss'],
})
export class AddCharacterComponent
  extends AbstractObservableDirective
  implements OnInit {
  readonly i18n = I18n.create('characters');

  characters: CharacterInfo[] = [];

  selected = false;

  selectedCharacter!: CharacterOverview;

  constructor(
    private service: CharacterService,
    private location: Location,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.service
      .getAllNotInProgress()
      .pipe(takeUntil(this.destroy$))
      .subscribe(characters => {
        this.logger.info('received non-party characters', characters);
        this.characters = characters;
      });
  }

  goBack(): void {
    this.location.back();
  }

  select(character: CharacterInfo): void {
    const created = this.service.create(character);
    this.selected = true;
    this.selectedCharacter = created;
    this.logger.info('select character', created);
  }

  reset(): void {
    this.selected = false;
    this.logger.info('reset');
  }

  add(): void {
    if (this.selected) {
      this.service.update(this.selectedCharacter);
      this.logger.info('added character', this.selectedCharacter);
      this.reset();
    }
  }
}
