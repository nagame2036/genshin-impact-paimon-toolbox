import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';
import {FormControl} from '@angular/forms';
import {rangeList} from '../../utils/range-list';
import {coerceIn} from '../../utils/coerce';
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

  levelStats = [
    {min: 1, max: 20},
    {min: 20, max: 40},
    {min: 40, max: 50},
    {min: 50, max: 60},
    {min: 60, max: 70},
    {min: 70, max: 80},
    {min: 80, max: 90},
  ];

  levels = this.levelStats.map(i => rangeList(i.min, i.max));

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
    const ascension = this.ascensionControl.value;
    const level = this.levelControl.value;
    const min = this.levelStats[ascension].min;
    const max = this.levelStats[ascension].max;
    this.levelControl.setValue(coerceIn(level, min, max));
    this.level.emit(new Level(ascension, level));
  }

}
