import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {rangeList} from '../../../shared/utils/range-list';
import {AscensionLevel} from '../../models/ascension-level.model';
import {Ascension} from '../../models/ascension.type';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.scss']
})
export class AscensionLevelSelectComponent implements OnInit {

  i18n = new I18n('shared.ascension-level');

  @Input()
  width = 128;

  @Input()
  horizontal = true;

  @Input()
  label!: string;

  ascensions: Ascension[] = rangeList(0, 6, true) as Ascension[];

  ascension: Ascension = 0;

  level = 1;

  @Output()
  levelChange = new EventEmitter<AscensionLevel>();

  constructor() {
  }

  get levels(): number[] {
    return AscensionLevel.levels(this.ascension);
  }

  ngOnInit(): void {
    this.change();
  }

  change(): void {
    const current = new AscensionLevel(this.ascension, this.level);
    this.level = current.level;
    this.levelChange.emit(current);
  }

  reset(): void {
    this.ascension = 0;
    this.level = 1;
  }
}
