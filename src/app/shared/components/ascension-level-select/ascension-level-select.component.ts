import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';
import {rangeList} from '../../utils/range-list';
import {AscensionLevel} from '../../models/ascension-level.model';
import {Ascension} from '../../models/ascension.enum';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.sass']
})
export class AscensionLevelSelectComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'shared.ascension-level';

  @Input()
  width = 128;

  @Input()
  horizontal = true;

  @Input()
  multi = false;

  @Input()
  label!: string;

  ascensions = rangeList(0, 6);

  @Input()
  ascension: Ascension = Ascension.ZERO;

  targetAscension: Ascension = this.ascension;

  levels = AscensionLevel.limit.map(i => rangeList(i.min, i.max));

  @Input()
  level = 1;

  targetLevel = this.level;

  @Output()
  levelChange = new EventEmitter<AscensionLevel>();

  @Output()
  multiLevelChange = new EventEmitter<{ current: AscensionLevel, target: AscensionLevel }>();

  constructor(public translator: TranslateService) {
    super();
  }

  get targetAscensions(): Ascension[] {
    return rangeList(this.ascension, Ascension.SIX);
  }

  get targetLevels(): Ascension[] {
    const limit = AscensionLevel.limit[this.targetAscension];
    return rangeList(limit.min, limit.max);
  }

  getAscension(value: number): Observable<string> {
    return this.translator.get('dict.ascensions.' + value);
  }

  ngOnInit(): void {
    this.change();
  }

  change(): void {
    const current = new AscensionLevel(this.ascension, this.level);
    this.level = current.level;
    if (!this.multi) {
      this.levelChange.emit(current);
      return;
    }
    const target = new AscensionLevel(this.targetAscension, this.targetLevel);
    this.targetLevel = target.level;
    this.multiLevelChange.emit({current, target});
  }

  reset(): void {
    this.ascension = Ascension.ZERO;
    this.level = 1;
  }

  setAscension(event: { current: number; target: number }): void {
    this.ascension = event.current;
    this.targetAscension = Math.max(this.ascension, event.target);
    this.change();
  }

  setLevel(event: { current: number; target: number }): void {
    this.level = AscensionLevel.correctLevel(this.ascension, event.current);
    this.targetLevel = AscensionLevel.correctLevel(this.targetAscension, event.target);
    this.change();
  }
}
