import {Component, EventEmitter, Input, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponViewService} from '../../services/weapon-view.service';

@Component({
  selector: 'app-weapon-view-options',
  templateUrl: './weapon-view-options.component.html',
  styleUrls: ['./weapon-view-options.component.scss'],
})
export class WeaponViewOptionsComponent {
  readonly i18n = I18n.create('weapon');

  @Input()
  viewSort = false;

  @Input()
  viewInfoSort = false;

  @Output()
  changed = new EventEmitter();

  constructor(public view: WeaponViewService) {}
}
