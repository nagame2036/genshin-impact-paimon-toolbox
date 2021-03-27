import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfoService} from '../../services/character-info.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-character-settings',
  templateUrl: './character-settings.component.html',
  styleUrls: ['./character-settings.component.scss'],
})
export class CharacterSettingsComponent implements OnInit {
  i18n = I18n.create('characters.settings');

  constructor(
    public information: CharacterInfoService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
