import {Component} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfoService} from '../../services/character-info.service';
import {Location} from '@angular/common';
import {allGenders} from '../../models/gender.enum';

@Component({
  selector: 'app-character-settings',
  templateUrl: './character-settings.component.html',
  styleUrls: ['./character-settings.component.scss'],
})
export class CharacterSettingsComponent {
  i18n = I18n.create('character.settings');

  genders = allGenders.map(it => ({value: it, text: this.i18n.data(`gender.${it}`)}));

  constructor(public information: CharacterInfoService, private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
