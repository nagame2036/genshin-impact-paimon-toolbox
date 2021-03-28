import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterViewService} from '../../services/character-view.service';

@Component({
  selector: 'app-character-view-options',
  templateUrl: './character-view-options.component.html',
  styleUrls: ['./character-view-options.component.scss'],
})
export class CharacterViewOptionsComponent implements OnInit {
  readonly i18n = I18n.create('characters');

  @Input()
  viewSort = false;

  @Input()
  viewInfoSort = false;

  @Output()
  changed = new EventEmitter();

  constructor(public view: CharacterViewService) {}

  ngOnInit(): void {}
}
