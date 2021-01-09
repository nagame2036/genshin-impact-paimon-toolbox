import {Component, Input} from '@angular/core';
import {I18n} from '../../models/i18n.model';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss']
})
export class ItemViewComponent {

  i18n = new I18n('item-view');

  @Input()
  width = 100;

  @Input()
  imgWidth = 100;

  @Input()
  category!: string;

  @Input()
  id!: number;

  @Input()
  key = 0;

  @Input()
  rarity = 1;

  active = false;

  constructor() {
  }

  get itemKey(): string {
    return `${this.category}.${this.id}`;
  }

  get src(): string {
    return `assets/images/${this.category}/${this.id}.png`;
  }

  get stars(): number[] {
    return new Array(this.rarity);
  }

}
