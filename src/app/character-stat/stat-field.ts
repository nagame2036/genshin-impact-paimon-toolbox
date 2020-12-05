import {FormControl, Validators} from '@angular/forms';
import {coerceIn} from '../shared/utils/coerce';
import {fixValue} from '../shared/utils/number';

export class StatField {

  min = 0;

  max?: number;

  suffix?: string;

  control: FormControl;

  correct: () => void;

  constructor(option: { min: number, max?: number, defaultValue?: number, suffix?: string, precision?: number } = {min: 0}) {
    const min = option.min;
    const max = option.max;
    const defaultVal = option.defaultValue ?? min;
    const precision = option.precision ?? 1;
    if (max) {
      this.control = new FormControl(defaultVal, [Validators.min(min), Validators.max(max)]);
      this.correct = () => {
        const value = fixValue(this.control.value, precision);
        this.control.setValue(coerceIn(value, min, max), {onlySelf: true});
      };
    } else {
      this.control = new FormControl(defaultVal, Validators.min(min));
      this.correct = () => {
        const value = fixValue(this.control.value, precision);
        this.control.setValue(Math.max(value, min), {onlySelf: true});
      };
    }
    this.min = min;
    this.max = max;
    this.suffix = option.suffix;
  }

  get value(): number {
    return this.control.value;
  }

  set value(value: number) {
    this.control.setValue(value);
    this.correct();
  }
}
