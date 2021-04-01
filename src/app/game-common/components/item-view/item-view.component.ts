import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ImageService, ImageType} from '../../../image/services/image.service';
import {rangeList} from '../../../shared/utils/range-list';
import {ItemInfo} from '../../models/item.model';

const backgroundType = ['element', 'rarity'] as const;

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemViewComponent implements OnChanges {
  i18n = I18n.create('item-view');

  @Input()
  width = 100;

  @Input()
  category!: ImageType;

  @Input()
  item!: ItemInfo<any>;

  stars: number[] = [];

  backgroundType = '';

  backgroundDeps = 0;

  itemKey!: string;

  constructor(public images: ImageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    for (const type of backgroundType) {
      const curr = changes.item.currentValue;
      const prev = changes.item.previousValue;
      if (curr[type] && curr[type] !== prev?.[type]) {
        this.backgroundType = type;
        this.backgroundDeps = (this.item as any)[type] ?? 0;
        break;
      }
    }
    if (changes.item) {
      this.itemKey = `${this.category}.${this.item.id}`;
      this.stars = rangeList(1, this.item.rarity);
    }
  }
}
