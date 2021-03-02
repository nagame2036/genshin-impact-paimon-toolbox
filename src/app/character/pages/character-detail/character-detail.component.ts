import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CharacterService} from '../../services/character.service';
import {first, switchMap} from 'rxjs/operators';
import {Character} from '../../models/character.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnInit {
  readonly i18n = new I18n('characters');

  character!: Character;

  characterId = -1;

  links = [{path: 'plan', text: this.i18n.module('plan.title')}];

  constructor(
    private characters: CharacterService,
    public images: ImageService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.logger.info('init');
    this.route.params
      .pipe(
        switchMap(params => this.characters.get(Number(params.id))),
        first(),
      )
      .subscribe(character => {
        this.logger.info('received character detail', character);
        this.character = character;
        this.characterId = character.info.id;
      });
  }

  goBack(): void {
    this.location.back();
  }

  remove(): void {
    this.characters.remove(this.character);
    this.logger.info('removed character', this.character);
    this.goBack();
  }
}
