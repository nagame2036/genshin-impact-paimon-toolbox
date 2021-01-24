import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialCostMarker} from '../../../material/services/material-cost-marker.service';
import {MaterialCostMark} from '../../../material/models/material-cost-mark.model';
import {I18n} from '../../../widget/models/i18n.model';
import {itemTypeNames} from '../../../game-common/models/item-type.enum';

@Component({
  selector: 'app-material-cost-detail-dialog',
  templateUrl: './material-cost-detail-dialog.component.html',
  styleUrls: ['./material-cost-detail-dialog.component.scss']
})
export class MaterialCostDetailDialogComponent implements OnInit {

  i18n = new I18n('inventory');

  id = 0;

  marks: MaterialCostMark[] = [];

  totalNeed = 0;

  types = itemTypeNames;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private marker: MaterialCostMarker) {
  }

  ngOnInit(): void {
  }

  open(id: number): void {
    this.dialog.open();
    this.id = id;
    this.marks = this.marker.getMarks(id).filter(it => it.need !== 0)
      .sort((a, b) => a.type - b.type || b.id - a.id);
    this.totalNeed = this.marks.reduce((acc, curr) => acc + curr.need, 0);
  }

}
