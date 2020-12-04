import {FormControl} from '@angular/forms';

export class CharacterStatChange {

  control: FormControl;

  constructor(formState: any, private current: FormControl, private comparedBy: FormControl) {
    this.control = new FormControl(formState);
    this.render();
  }

  render(): void {
    const value = (this.comparedBy.value / this.current.value - 1) * 100;
    if (Number.isNaN(value)) {
      this.control.setValue('0.0');
    } else if (Number.isFinite(value)) {
      this.control.setValue(value.toFixed(1));
    } else {
      this.control.setValue('∞');
    }
  }
}
