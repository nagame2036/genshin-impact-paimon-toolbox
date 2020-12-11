import {Component, Input, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';

@Component({
  selector: 'app-item-image-container',
  templateUrl: './item-image-container.component.html',
  styleUrls: ['./item-image-container.component.sass']
})
export class ItemImageContainerComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'item-image-container';

  @Input()
  category!: string;

  @Input()
  id!: number;

  @Input()
  rarity = 1;

  constructor() {
    super();
  }

  get itemKey(): string {
    return `${this.category}.items.${this.id}`;
  }

  get src(): string {
    return `assets/images/${this.category}/${this.id}.png`;
  }

  get stars(): number[] {
    return new Array(this.rarity);
  }

  ngOnInit(): void {
  }

}
