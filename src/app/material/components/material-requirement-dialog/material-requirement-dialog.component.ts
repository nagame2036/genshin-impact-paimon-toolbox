import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialRequireMark} from '../../models/material-require-mark.model';
import {I18n} from '../../../widget/models/i18n.model';
import {itemTypeNames} from '../../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialService} from '../../services/material.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-material-requirement-dialog',
  templateUrl: './material-requirement-dialog.component.html',
  styleUrls: ['./material-requirement-dialog.component.scss']
})
export class MaterialRequirementDialogComponent implements OnInit {

  i18n = new I18n('inventory');

  id = 0;

  subscription!: Subscription;

  marks: MaterialRequireMark[][] = [];

  totalNeed = 0;

  types = itemTypeNames;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private materials: MaterialService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(id: number): void {
    this.id = id;
    this.subscription = this.materials.getRequireMarks(id).subscribe(marks => {
      const sortedMarks = marks.sort((a, b) => a.type - b.type || b.id - a.id);
      const groupedMarks = new Map<number, MaterialRequireMark[]>();
      for (const mark of sortedMarks) {
        const key = mark.key;
        const group = groupedMarks.get(key) ?? [];
        group.push(mark);
        groupedMarks.set(key, group);
      }
      this.marks = [...groupedMarks.values()];
      this.totalNeed = sortedMarks.reduce((acc, curr) => acc + curr.need, 0);
      this.logger.info('received marks', this.marks);
    });
    this.dialog.open();
    this.logger.info('opened with id', id);
  }

  close(): void {
    this.subscription?.unsubscribe();
    this.dialog.close();
  }
}
