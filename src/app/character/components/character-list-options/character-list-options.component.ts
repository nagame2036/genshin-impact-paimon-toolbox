import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterViewService} from '../../services/character-view.service';

@Component({
  selector: 'app-character-list-options',
  templateUrl: './character-list-options.component.html',
  styleUrls: ['./character-list-options.component.scss'],
})
export class CharacterListOptionsComponent implements OnInit {
  readonly i18n = new I18n('characters');

  @Input()
  viewSort = false;

  @Input()
  viewInfoSort = false;

  @Output()
  changed = new EventEmitter();

  constructor(public view: CharacterViewService) {}

  ngOnInit(): void {}
}
