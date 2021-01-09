import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {rangeList} from '../../../shared/utils/range-list';
import {Ascension} from '../../../character-and-gear/models/ascension.type';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';

@Component({
  selector: 'app-current-goal-level-select',
  templateUrl: './current-goal-level-select.component.html',
  styleUrls: ['./current-goal-level-select.component.scss']
})
export class CurrentGoalLevelSelectComponent implements OnInit {

  i18n = new I18n('party.current-goal-level-select');

  @Input()
  label!: string;

  ascensions: Ascension[] = rangeList(0, 6, true) as Ascension[];

  @Input()
  ascension!: Ascension;

  goalAscensions!: Ascension[];

  @Input()
  goalAscension!: Ascension;

  levels!: number[];

  @Input()
  level!: number;

  goalLevels!: number[];

  @Input()
  goalLevel!: number;

  @Output()
  currentChange = new EventEmitter<AscensionLevel>();

  @Output()
  goalChange = new EventEmitter<AscensionLevel>();

  constructor(public translator: TranslateService) {
  }

  ngOnInit(): void {
    this.levels = AscensionLevel.levels(this.ascension);
    this.goalAscensions = rangeList(this.ascension, 6, true) as Ascension[];
    this.goalLevels = AscensionLevel.levels(this.goalAscension, this.level);
  }

  getAscension(num: number): Observable<string> {
    return this.translator.get(`dict.ascensions.${num}`);
  }

  setAscension(value: number): void {
    this.ascension = value as Ascension;
    this.levels = AscensionLevel.levels(this.ascension);
    this.level = AscensionLevel.correctLevel(this.ascension, this.level);
    this.emitCurrentChange();
    this.goalAscensions = rangeList(this.ascension, 6, true) as Ascension[];
    if (this.goalAscension < value) {
      this.setGoalAscension(value);
    }
  }

  setGoalAscension(value: number): void {
    this.goalAscension = value as Ascension;
    this.goalLevels = AscensionLevel.levels(this.goalAscension, this.level);
    this.goalLevel = AscensionLevel.correctLevel(this.goalAscension, this.goalLevel);
    this.emitGoalChange();
  }

  setLevel(value: number): void {
    this.level = value;
    this.goalLevels = AscensionLevel.levels(this.goalAscension, this.level);
    this.emitCurrentChange();
    if (this.goalLevel < value) {
      this.setGoalLevel(value);
    }
  }

  setGoalLevel(value: number): void {
    this.goalLevel = value;
    this.emitGoalChange();
  }

  private emitCurrentChange(): void {
    this.currentChange.emit(new AscensionLevel(this.ascension, this.level));
  }

  private emitGoalChange(): void {
    this.goalChange.emit(new AscensionLevel(this.goalAscension, this.goalLevel));
  }
}
