import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialRequireMark} from '../../models/material-require-mark.model';
import {I18n} from '../../../widget/models/i18n.model';
import {itemTypeNames} from '../../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialService} from '../../services/material.service';
import {MaterialDetail} from '../../models/material.model';

@Component({
  selector: 'app-material-requirement-dialog',
  templateUrl: './material-requirement-dialog.component.html',
  styleUrls: ['./material-requirement-dialog.component.scss'],
})
export class MaterialRequirementDialogComponent implements OnInit {
  i18n = I18n.create('inventory');

  totalAmountPurpose = this.i18n.dict('total-amount');

  id = 0;

  have = 0;

  marks: MaterialRequireMark[][] = [];

  types = itemTypeNames;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(public materials: MaterialService, private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(item: MaterialDetail): void {
    this.id = item.info.id;
    this.have = item.have;
    const marks = this.materials.getRequireMarks(this.id);
    const sortedMarks = marks.sort((a, b) => a.type - b.type || b.id - a.id);
    const groupedMarks = new Map<number, MaterialRequireMark[]>();
    for (const mark of sortedMarks) {
      const key = mark.key;
      const group = groupedMarks.get(key) ?? [];
      group.push(mark);
      if (!groupedMarks.has(key)) {
        groupedMarks.set(key, group);
      }
    }
    const purpose = this.totalAmountPurpose;
    const summedMarks = [];
    for (const group of groupedMarks.values()) {
      if (group.length > 1) {
        const need = group.reduce((acc, curr) => acc + curr.need, 0);
        const sumMark = {...group[0], purpose, need};
        group.push(sumMark);
      }
      summedMarks.push(group);
    }
    this.marks = summedMarks;
    this.logger.info('received marks', item, this.marks);
    this.dialog.open();
  }

  close(): void {
    this.dialog.close();
  }
}
