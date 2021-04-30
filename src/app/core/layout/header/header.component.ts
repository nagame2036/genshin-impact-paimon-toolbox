import {Component, EventEmitter, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {SettingService} from '../../../setting/services/setting.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  i18n = I18n.create('core');

  @Output()
  showMenu = new EventEmitter<boolean>();

  constructor(public settings: SettingService) {}
}
