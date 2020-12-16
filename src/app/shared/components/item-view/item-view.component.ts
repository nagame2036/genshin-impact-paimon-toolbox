import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AbstractTranslateComponent} from '../abstract-translate.component';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.sass']
})
export class ItemViewComponent extends AbstractTranslateComponent implements AfterViewInit {

  i18nKey = 'item-view';

  @Input()
  category!: string;

  @Input()
  id!: number;

  @Input()
  rarity = 1;

  @ViewChild('right', {read: ElementRef})
  detail: ElementRef | undefined;

  hasRight = false;

  constructor() {
    super();
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

  ngAfterViewInit(): void {
    const detailHasChild = this.detail?.nativeElement.childNodes.length ?? 0;
    setTimeout(() => this.hasRight = detailHasChild > 1, 10);
  }

}
