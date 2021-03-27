import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponViewService} from '../../services/weapon-view.service';

@Component({
  selector: 'app-weapon-list-options',
  templateUrl: './weapon-list-options.component.html',
  styleUrls: ['./weapon-list-options.component.scss'],
})
export class WeaponListOptionsComponent implements OnInit {
  readonly i18n = I18n.create('weapons');

  @Input()
  viewSort = false;

  @Input()
  viewInfoSort = false;

  @Output()
  changed = new EventEmitter();

  constructor(public view: WeaponViewService) {}

  ngOnInit(): void {}
}
