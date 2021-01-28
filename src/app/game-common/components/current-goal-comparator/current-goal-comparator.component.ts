import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-current-goal-comparator',
  templateUrl: './current-goal-comparator.component.html',
  styleUrls: ['./current-goal-comparator.component.scss']
})
export class CurrentGoalComparatorComponent implements OnInit {

  @Input()
  current!: string | null;

  @Input()
  goal!: string | null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
