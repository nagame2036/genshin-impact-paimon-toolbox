import {FormControl, Validators} from '@angular/forms';
import {coerceAtLeast, coerceIn} from '../../shared/utils/coerce';

export class CharacterStatField {

  min = 0;

  max?: number;

  suffix?: string;

  control: FormControl;

  correct: () => void;

  constructor(option: { min: number, max?: number, suffix?: string } = {min: 0}) {
    const min = option.min;
    const max = option.max;
    if (max) {
      this.control = new FormControl(min, [Validators.min(min), Validators.max(max)]);
      this.correct = () => {
        this.control.setValue(coerceIn(this.control.value, min, max), {onlySelf: true});
      };
    } else {
      this.control = new FormControl(min, Validators.min(min));
      this.correct = () => {
        this.control.setValue(coerceAtLeast(this.control.value, min), {onlySelf: true});
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
