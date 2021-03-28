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
  id!: number;

  @Input()
  rarity = 1;

  stars: number[] = [];

  @Input()
  backgroundDeps = this.rarity;

  @Input()
  backgroundType: 'rarity' | 'element' = 'rarity';

  itemKey!: string;

  constructor(public images: ImageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.backgroundType === 'rarity' && changes.rarity) {
      this.backgroundDeps = this.rarity;
    }
    if (changes.id) {
      this.itemKey = `${this.category}.${this.id}`;
    }
    if (changes.rarity) {
      this.stars = rangeList(1, this.rarity);
    }
  }
}
