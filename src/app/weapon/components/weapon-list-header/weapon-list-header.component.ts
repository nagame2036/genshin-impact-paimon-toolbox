import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {WeaponViewService} from '../../services/weapon-view.service';

@Component({
  selector: 'app-weapon-list-header',
  templateUrl: './weapon-list-header.component.html',
  styleUrls: ['./weapon-list-header.component.scss'],
})
export class WeaponListHeaderComponent implements OnInit {
  readonly i18n = new I18n('weapons');

  @Input()
  sorts!: SelectOption[];

  @Input()
  sort!: any[];

  @Output()
  changed = new EventEmitter();

  @Output()
  sortChanged = new EventEmitter();

  constructor(public view: WeaponViewService) {}

  ngOnInit(): void {}
}
