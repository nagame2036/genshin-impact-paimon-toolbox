import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {rangeList} from '../../../shared/utils/range-list';
import {AscensionLevel} from '../../models/ascension-level.model';
import {Ascension} from '../../models/ascension.enum';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.scss']
})
export class AscensionLevelSelectComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'shared.ascension-level';

  @Input()
  width = 128;

  @Input()
  horizontal = true;

  @Input()
  label!: string;

  ascensions = rangeList(Ascension.ZERO, Ascension.SIX, true);

  ascension: Ascension = Ascension.ZERO;

  level = 1;

  @Output()
  levelChange = new EventEmitter<AscensionLevel>();

  constructor() {
    super();
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
    this.ascension = Ascension.ZERO;
    this.level = 1;
  }
}
