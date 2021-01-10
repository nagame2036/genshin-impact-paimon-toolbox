import {Component, Input} from '@angular/core';
import {I18n} from '../../models/i18n.model';
import {ImageService} from '../../../image/services/image.service';

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

  constructor(public images: ImageService) {
  }

  get itemKey(): string {
    return `${this.category}.${this.id}`;
  }

  get stars(): number[] {
    return new Array(this.rarity);
  }

}
