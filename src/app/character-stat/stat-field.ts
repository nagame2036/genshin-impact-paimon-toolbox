import {FormControl, Validators} from '@angular/forms';
import {coerceIn} from '../shared/utils/coerce';

export class StatField {

  min = 0;

  max?: number;

  suffix?: string;

  control: FormControl;

  correct: () => void;

  constructor(option: { min: number, max?: number, defaultValue?: number, suffix?: string } = {min: 0}) {
    const min = option.min;
    const max = option.max;
    const defaultVal = option.defaultValue ?? min;
    if (max) {
      this.control = new FormControl(defaultVal, [Validators.min(min), Validators.max(max)]);
      this.correct = () => {
        this.control.setValue(coerceIn(this.control.value, min, max), {onlySelf: true});
      };
    } else {
      this.control = new FormControl(defaultVal, Validators.min(min));
      this.correct = () => {
        this.control.setValue(Math.max(this.control.value, min), {onlySelf: true});
      };
    }
    this.min = min;
    this.max = max;
    this.suffix = option.suffix;
  }

  get value(): number {
    return this.control.value;
  }
}
