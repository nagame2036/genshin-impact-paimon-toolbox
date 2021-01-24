import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CharacterService} from '../../../character/services/character.service';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {ImageService} from '../../../image/services/image.service';

@Component({
  selector: 'app-party-character-detail',
  templateUrl: './party-character-detail.component.html',
  styleUrls: ['./party-character-detail.component.scss']
})
export class PartyCharacterDetailComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('party.characters');

  characterId!: number;

  character!: PartyCharacter;

  links = [
    {path: 'plan', text: this.i18n.module('plan.title')},
  ];

  constructor(private route: ActivatedRoute, private location: Location, private characters: CharacterService,
              public images: ImageService) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => Number(params.id)),
        switchMap(id => this.characters.getPartyCharacter(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(character => {
        this.character = character;
        this.characterId = character.id;
      });
  }

  goBack(): void {
    this.location.back();
  }

  remove(): void {
    this.characters.removePartyMember(this.characterId);
    this.goBack();
  }
}
