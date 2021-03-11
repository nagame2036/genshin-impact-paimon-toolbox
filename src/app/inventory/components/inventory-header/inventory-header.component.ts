import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {NGXLogger} from 'ngx-logger';
import {MaterialViewService} from '../../../material/services/material-view.service';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss'],
})
export class InventoryHeaderComponent
  extends AbstractObservableComponent
  implements OnInit {
  i18n = new I18n('inventory');

  constructor(public view: MaterialViewService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
  }
}
