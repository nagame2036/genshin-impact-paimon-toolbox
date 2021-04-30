import {Component, Input} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {MaterialDetail} from '../../models/material.model';
import {MaterialService} from '../../services/material.service';
import {MaterialListData} from '../../models/material-list-data.model';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
})
export class MaterialListComponent {
  i18n = I18n.create('inventory');

  @Input()
  conciseMode = false;

  @Input()
  materials!: MaterialListData[];

  @Input()
  subtitle!: string[];

  @Input()
  hiddenDetail = false;

  constructor(public service: MaterialService) {}

  setHave(detail: MaterialDetail, value: number): void {
    const have = Math.max(0, value);
    const id = detail.info.id;
    this.service.updateHave(id, have);
  }

  correct(detail: MaterialDetail, value: string): void {
    const text = value.replace(/,/gi, '');
    this.setHave(detail, Number(text) || 0);
  }

  trackItem(index: number, item: MaterialDetail): number {
    return item.info.id;
  }

  notCraftable(item: MaterialDetail): boolean {
    return !item.craftable || item.readonly;
  }

  getCraftBtnText(item: MaterialDetail): string {
    if (!item.info.recipes || item.readonly) {
      return this.i18n.module('cant-craft');
    } else if (item.craftable) {
      return this.i18n.module('craft');
    }
    return this.i18n.module('insufficient');
  }
}
