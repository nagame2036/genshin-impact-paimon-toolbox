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
  width = 128;

  @Input()
  label = '';

  @Input()
  currentAvailableValues!: number[];

  @Input()
  current!: number;

  @Input()
  targetAvailableValues!: number[];

  @Input()
  target = 0;

  @Output()
  changed = new EventEmitter<{ current: number, target: number }>();

  constructor(
    /**
     * inject this translator to provide translation in valueDisplay().
     */
    private translator: TranslateService) {
  }

  @Input()
  valueDisplay: (value: number) => Observable<string> = (value: number) => of(value.toString());

  ngOnInit(): void {
    // avoid NG0100: ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.update(), 5);
  }

  update(): void {
    this.targetAvailableValues = this.targetAvailableValues.filter(it => it >= this.current);
    if (this.target < this.current) {
      this.target = this.current;
    }
  }

  change(): void {
    this.update();
    this.changed.emit({current: this.current, target: this.target});
  }
}
