import {Component, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialRequireMark} from '../../models/material-require-mark.model';
import {I18n} from '../../../widget/models/i18n.model';
import {itemTypeNames as types} from '../../../game-common/models/item-type.type';
import {MaterialService} from '../../services/material.service';
import {MaterialDetail} from '../../models/material.model';

@Component({
  selector: 'app-material-detail-dialog',
  templateUrl: './material-detail-dialog.component.html',
  styleUrls: ['./material-detail-dialog.component.scss'],
})
export class MaterialDetailDialogComponent {
  i18n = I18n.create('inventory');

  totalAmountPurpose = this.i18n.dict('total-amount');

  id = 0;

  have = 0;

  marks: MaterialRequireMark[][] = [];

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(public materials: MaterialService) {}

  open(item: MaterialDetail): void {
    this.id = item.info.id;
    this.have = item.have;
    const marks = this.materials
      .getRequireMarks(this.id)
      .sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type) || b.id - a.id);
    const groupedMarks = new Map<number, MaterialRequireMark[]>();
    for (const mark of marks) {
      const key = mark.key;
      const group = groupedMarks.get(key) ?? [];
      group.push(mark);
      groupedMarks.set(key, group);
    }
    this.marks = [];
    for (const group of groupedMarks.values()) {
      if (group.length > 1) {
        const need = group.reduce((acc, curr) => acc + curr.need, 0);
        const sumMark = {...group[0], need, purpose: this.totalAmountPurpose};
        group.push(sumMark);
      }
      this.marks.push(group);
    }
    this.dialog.open();
  }

  close(): void {
    this.dialog.close();
  }
}
