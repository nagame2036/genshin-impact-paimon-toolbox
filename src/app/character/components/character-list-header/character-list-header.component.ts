import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterViewService} from '../../services/character-view.service';
import {SelectOption} from '../../../widget/models/select-option.model';

@Component({
  selector: 'app-character-list-header',
  templateUrl: './character-list-header.component.html',
  styleUrls: ['./character-list-header.component.scss'],
})
export class CharacterListHeaderComponent implements OnInit {
  readonly i18n = new I18n('characters');

  @Input()
  sorts!: SelectOption[];

  @Input()
  sort!: any;

  @Output()
  changed = new EventEmitter();

  @Output()
  sortChanged = new EventEmitter();

  constructor(public view: CharacterViewService) {}

  ngOnInit(): void {}
}
