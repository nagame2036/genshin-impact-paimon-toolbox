import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MaterialCostMarker} from '../../../material/services/material-cost-marker.service';
import {MaterialCostMark} from '../../../material/models/material-cost-mark.model';
import {I18n} from '../../../shared/models/i18n.model';
import {itemTypeNames} from '../../../character-and-gear/models/item-type.enum';

@Component({
  selector: 'app-material-cost-detail-dialog',
  templateUrl: './material-cost-detail-dialog.component.html',
  styleUrls: ['./material-cost-detail-dialog.component.scss']
})
export class MaterialCostDetailDialogComponent implements OnInit {

  i18n = new I18n('inventory');

  marks: MaterialCostMark[];

  totalNeed: number;

  types = itemTypeNames;

  constructor(marker: MaterialCostMarker, @Inject(MAT_DIALOG_DATA) public id: number,
              private dialog: MatDialogRef<MaterialCostDetailDialogComponent>) {
    this.marks = marker.getMarks(id).filter(it => it.need !== 0)
      .sort((a, b) => a.type - b.type || b.id - a.id);
    this.totalNeed = this.marks.reduce((acc, curr) => acc + curr.need, 0);
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialog.close();
  }

}
