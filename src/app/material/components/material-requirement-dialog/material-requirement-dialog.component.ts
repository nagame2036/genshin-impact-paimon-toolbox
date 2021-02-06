import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialRequireMark, MaterialRequireMarkDetail} from '../../models/material-require-mark.model';
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

  marks: MaterialRequireMark[] = [];

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
    this.subscription?.unsubscribe();
    this.subscription = this.materials.getRequireMarks(id).subscribe(marks => {
      this.marks = marks.sort((a, b) => a.type - b.type || b.id - a.id);
      let need = 0;
      for (const mark of this.marks) {
        for (const detail of mark.details.values()) {
          need += detail.need;
        }
      }
      this.totalNeed = need;
      this.logger.info('received marks', this.marks);
    });
    this.dialog.open();
    this.logger.info('opened with id', id);
  }

  getDetails(mark: MaterialRequireMark): MaterialRequireMarkDetail[] {
    return [...mark.details.values()];
  }
}
