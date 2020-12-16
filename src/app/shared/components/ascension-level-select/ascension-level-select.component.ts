import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';
import {rangeList} from '../../utils/range-list';
import {Level} from '../../models/level';
import {Ascension} from '../../models/ascension.enum';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.sass']
})
export class AscensionLevelSelectComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'shared.ascension-level';

  @Input()
  horizontal = true;

  @Input()
  label!: string;

  ascensions = rangeList(0, 6);

  ascension: Ascension = Ascension.ZERO;

  levelLimit = Level.levelLimit;

  levels = this.levelLimit.map(i => rangeList(i.min, i.max));

  level = 1;

  @Output()
  levelChange = new EventEmitter<Level>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.change();
  }

  change(): void {
    const level = new Level(this.ascension, this.level);
    this.level = level.level;
    this.levelChange.emit(level);
  }

  reset(): void {
    this.ascension = Ascension.ZERO;
    this.level = 1;
  }

}
