/* tslint:disable:semicolon */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

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

  @Output()
  currentChange = new EventEmitter<number>();

  @Output()
  goalChange = new EventEmitter<number>();

  // noinspection JSUnusedLocalSymbols
  constructor(
    /**
     * inject this translator to provide translation in valueDisplay().
     */
    private translator: TranslateService) {
  }

  @Input()
  valueDisplay: (value: number) => Observable<string> = (value: number) => of(value.toString());

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
}
