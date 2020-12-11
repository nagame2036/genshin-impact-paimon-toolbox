import {Component, Input, OnInit} from '@angular/core';
import {coerceIn} from '../../../shared/utils/coerce';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.sass']
})
export class AmountInputComponent implements OnInit {

  @Input()
  width = 100;

  @Input()
  id!: number;

  value = 0;

  @Input()
  incStep = 1;

  private numReg = /[0-9]*/;

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getAmount(this.id).subscribe(res => this.value = res.amount);
  }

  setValue(value: number): void {
    this.value = coerceIn(value, 0, 999_999_999_999);
    this.inventory.setAmount(this.id, this.value);
  }

  inc(): void {
    this.setValue(this.value + this.incStep);
  }

  dec(): void {
    this.setValue(this.value - this.incStep);
  }

  correct(event: Event): void {
    const target = event.target as HTMLInputElement;
    const text = target.value.replace(/,/gi, '');
    if (this.numReg.test(text)) {
      this.setValue(Number(text));
      return;
    }
    event.preventDefault();
  }
}
