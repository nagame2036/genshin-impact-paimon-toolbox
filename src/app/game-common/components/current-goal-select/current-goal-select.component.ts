import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectOption} from '../../../widget/models/select-option.model';

@Component({
  selector: 'app-current-goal-select',
  templateUrl: './current-goal-select.component.html',
  styleUrls: ['./current-goal-select.component.scss']
})
export class CurrentGoalSelectComponent implements OnInit {

  @Input()
  currentOptions!: SelectOption[];

  @Input()
  current!: any;

  @Input()
  goalOptions!: SelectOption[];

  @Input()
  goal!: any;

  @Input()
  reached!: boolean;

  @Output()
  currentChange = new EventEmitter<number>();

  @Output()
  goalChange = new EventEmitter<number>();

  @Output()
  executePlan = new EventEmitter();

  constructor() {
  }

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
    return available === true && this.current !== this.goal;
  }
}
