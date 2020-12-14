import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';
import {FormControl} from '@angular/forms';
import {rangeList} from '../../utils/range-list';
import {Level} from '../../models/level';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.sass']
})
export class AscensionLevelSelectComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'shared.ascension-level';

  ascensions = rangeList(0, 6);

  ascensionControl = new FormControl(6);

  levelLimit = Level.levelLimit;

  levels = this.levelLimit.map(i => rangeList(i.min, i.max));

  levelControl = new FormControl(90);

  @Output()
  level = new EventEmitter<Level>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.correct();
  }

  correct(): void {
    const level = new Level(this.ascensionControl.value, this.levelControl.value);
    this.levelControl.setValue(level.level);
    this.level.emit(level);
  }

}
