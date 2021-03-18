import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ImageService, ImageType} from '../../../image/services/image.service';
import {rangeList} from '../../../shared/utils/range-list';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemViewComponent implements OnInit {
  i18n = new I18n('item-view');

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

  itemKey!: string;

  constructor(public images: ImageService) {}

  get backgroundId(): number {
    if (this.category === 'characters') {
      return this.backgroundDeps + 100;
    }
    return this.rarity;
  }

  ngOnInit(): void {
    this.itemKey = `${this.category}.${this.id}`;
    this.stars = rangeList(1, this.rarity);
  }
}
