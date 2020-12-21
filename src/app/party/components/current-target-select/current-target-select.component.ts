/* tslint:disable:semicolon */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-current-target-select',
  templateUrl: './current-target-select.component.html',
  styleUrls: ['./current-target-select.component.sass']
})
export class CurrentTargetSelectComponent implements OnInit {

  @Input()
  currentOptions!: number[];

  @Input()
  current!: number;

  @Input()
  targetOptions!: number[];

  @Input()
  target = 0;

  @Output()
  currentChanged = new EventEmitter<number>();

  @Output()
  targetChanged = new EventEmitter<number>();

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

  changeCurrent(value: number): void {
    this.current = value;
    if (this.target < value) {
      this.changeTarget(value);
      return;
    }
    this.currentChanged.emit(value);
  }

  changeTarget(value: number): void {
    this.target = value;
    this.targetChanged.emit(value);
  }
}
