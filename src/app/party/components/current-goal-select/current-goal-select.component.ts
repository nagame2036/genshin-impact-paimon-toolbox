/* tslint:disable:semicolon */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-current-goal-select',
  templateUrl: './current-goal-select.component.html',
  styleUrls: ['./current-goal-select.component.scss']
})
export class CurrentGoalSelectComponent implements OnInit {

  @Input()
  currentOptions!: number[];

  @Input()
  current!: number;

  @Input()
  goalOptions!: number[];

  @Input()
  goal = 0;

  @Input()
  satisfied!: Observable<boolean>;

  @Output()
  currentChange = new EventEmitter<number>();

  @Output()
  goalChange = new EventEmitter<number>();

  @Output()
  executePlan = new EventEmitter();

  // noinspection JSUnusedLocalSymbols
  constructor(
    /**
     * inject this translator to provide translation in valueDisplay().
     */
    private translator: TranslateService) {
  }

  @Input()
  valueDisplay: (value: number) => string = (value: number) => value.toString();

  ngOnInit(): void {
  }

  setCurrent(value: number): void {
    this.current = value;
    this.currentChange.emit(value);
    if (this.goal < value) {
      this.setGoal(value);
    }
  }

  setGoal(value: number): void {
    this.goal = value;
    this.goalChange.emit(value);
  }

  checkPlanAvailable(available: boolean | null): boolean {
    return available === true && this.current !== this.goal && this.currentOptions.includes(this.goal);
  }
}
