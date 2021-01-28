import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {rangeList} from '../../../shared/utils/range-list';
import {Ascension} from '../../models/ascension.type';
import {AscensionLevel} from '../../models/ascension-level.model';
import {Observable} from 'rxjs';
import {SelectOption} from '../../../widget/models/select-option.model';

@Component({
  selector: 'app-current-goal-level-select',
  templateUrl: './current-goal-level-select.component.html',
  styleUrls: ['./current-goal-level-select.component.scss']
})
export class CurrentGoalLevelSelectComponent implements OnInit, OnChanges {

  i18n = new I18n('game-common');

  @Input()
  label!: string;

  ascensions!: SelectOption[];

  @Input()
  ascension!: Ascension;

  goalAscensions!: SelectOption[];

  @Input()
  goalAscension!: Ascension;

  levels!: SelectOption[];

  @Input()
  level!: number;

  goalLevels!: SelectOption[];

  @Input()
  goalLevel!: number;

  @Input()
  satisfied!: Observable<boolean>;

  @Output()
  currentChange = new EventEmitter<AscensionLevel>();

  @Output()
  goalChange = new EventEmitter<AscensionLevel>();

  @Output()
  executePlan = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.ascensions = (rangeList(0, 6, true) as Ascension[]).map(this.getAscension);
    this.levels = this.getLevels();
    this.goalAscensions = this.getGoalAscensions();
    this.goalLevels = this.getGoalLevels();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('ascension')) {
      this.setAscension(this.ascension, false);
    }
  }

  getGoalAscensions(): SelectOption[] {
    return (rangeList(this.ascension, 6, true) as Ascension[]).map(this.getAscension);
  }

  getLevels(): SelectOption[] {
    return AscensionLevel.levels(this.ascension).map(this.getLevel);
  }

  getGoalLevels(): SelectOption[] {
    return AscensionLevel.levels(this.goalAscension, this.level).map(this.getLevel);
  }

  getAscension(num: number): SelectOption {
    return {value: num, text: `★${num}`};
  }

  getLevel(num: number): SelectOption {
    return {value: num, text: `${num}`};
  }

  setAscension(value: number, emit: boolean = true): void {
    this.ascension = value as Ascension;
    this.levels = this.getLevels();
    this.level = AscensionLevel.correctLevel(this.ascension, this.level);
    if (emit) {
      this.emitCurrentChange();
    }
    this.goalAscensions = this.getGoalAscensions();
    if (this.goalAscension < value) {
      this.setGoalAscension(value, emit);
    }
  }

  setGoalAscension(value: number, emit: boolean = true): void {
    this.goalAscension = value as Ascension;
    this.goalLevels = this.getGoalLevels();
    this.goalLevel = AscensionLevel.correctLevel(this.goalAscension, this.goalLevel);
    if (emit) {
      this.emitGoalChange();
    }
  }

  setLevel(value: number): void {
    this.level = value;
    this.goalLevels = this.getGoalLevels();
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
