import {FormControl} from '@angular/forms';

export class CharacterStatChange {

  control: FormControl;

  constructor(formState: any, private current: FormControl, private comparedBy: FormControl) {
    this.control = new FormControl(formState);
    this.render();
  }

  render(): void {
    const text = ((this.comparedBy.value / this.current.value - 1) * 100).toFixed(1);
    this.control.setValue(text);
  }
}
