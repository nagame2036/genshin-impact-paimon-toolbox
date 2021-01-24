import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialRequireMarker} from '../../services/material-require-marker.service';
import {MaterialRequireMark} from '../../models/material-require-mark.model';
import {I18n} from '../../../widget/models/i18n.model';
import {itemTypeNames} from '../../../game-common/models/item-type.enum';

@Component({
  selector: 'app-material-requirement-dialog',
  templateUrl: './material-requirement-dialog.component.html',
  styleUrls: ['./material-requirement-dialog.component.scss']
})
export class MaterialRequirementDialogComponent implements OnInit {

  i18n = new I18n('inventory');

  id = 0;

  marks: MaterialRequireMark[] = [];

  totalNeed = 0;

  types = itemTypeNames;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private marker: MaterialRequireMarker) {
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
