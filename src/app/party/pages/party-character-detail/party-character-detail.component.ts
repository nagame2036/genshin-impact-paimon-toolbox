import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CharacterService} from '../../../character/services/character.service';
import {takeUntil} from 'rxjs/operators';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-party-character-detail',
  templateUrl: './party-character-detail.component.html',
  styleUrls: ['./party-character-detail.component.scss']
})
export class PartyCharacterDetailComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('party.characters');

  characterId!: number;

  links = [
    'plan',
  ];

  constructor(private route: ActivatedRoute, private location: Location, private characters: CharacterService) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.characterId = params.id);
  }

  goBack(): void {
    this.location.back();
  }

  remove(): void {
    this.characters.removePartyMember(this.characterId);
    this.goBack();
  }
}
