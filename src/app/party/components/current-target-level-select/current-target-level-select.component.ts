import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {rangeList} from '../../../shared/utils/range-list';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';

@Component({
  selector: 'app-current-target-level-select',
  templateUrl: './current-target-level-select.component.html',
  styleUrls: ['./current-target-level-select.component.sass']
})
export class CurrentTargetLevelSelectComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.current-target-level-select';

  @Input()
  label!: string;

  ascensions = rangeList(Ascension.ZERO, Ascension.SIX);

  @Input()
  ascension!: Ascension;

  targetAscensions!: Ascension[];

  @Input()
  targetAscension!: Ascension;

  levels!: number[];

  @Input()
  level!: number;

  targetLevels!: number[];

  @Input()
  targetLevel!: number;

  @Output()
  changed = new EventEmitter<{ current: AscensionLevel, target: AscensionLevel }>();

  constructor(public translator: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.levels = AscensionLevel.levels(this.ascension);
    this.targetAscensions = rangeList(this.ascension, Ascension.SIX);
    this.targetLevels = AscensionLevel.levels(this.targetAscension, this.level);
  }

  getAscension(num: number): Observable<string> {
    return this.translator.get(`dict.ascensions.${num}`);
  }

  emitChanges(): void {
    const current = new AscensionLevel(this.ascension, this.level);
    const target = new AscensionLevel(this.targetAscension, this.targetLevel);
    this.changed.emit({current, target});
  }

  setAscension(value: number): void {
    this.ascension = value;
    this.levels = AscensionLevel.levels(this.ascension);
    this.level = AscensionLevel.correctLevel(this.ascension, this.level);
    this.targetAscensions = rangeList(this.ascension, Ascension.SIX);
    if (this.targetAscension < value) {
      this.setTargetAscension(value);
      return;
    }
    this.emitChanges();
  }

  setTargetAscension(value: number): void {
    this.targetAscension = value;
    this.targetLevels = AscensionLevel.levels(this.targetAscension, this.level);
    this.targetLevel = AscensionLevel.correctLevel(this.targetAscension, this.targetLevel);
    this.emitChanges();
  }

  setLevel(value: number): void {
    this.level = value;
    this.targetLevels = AscensionLevel.levels(this.targetAscension, this.level);
    if (this.targetLevel < value) {
      this.setTargetLevel(value);
      return;
    }
    this.emitChanges();
  }

  setTargetLevel(value: number): void {
    this.targetLevel = value;
    this.emitChanges();
  }
}
