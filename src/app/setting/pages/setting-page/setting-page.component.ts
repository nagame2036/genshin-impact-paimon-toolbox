import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {SettingService} from '../../services/setting.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss'],
})
export class SettingPageComponent implements OnInit {
  i18n = I18n.create('settings');

  constructor(public settings: SettingService) {}

  ngOnInit(): void {}
}
