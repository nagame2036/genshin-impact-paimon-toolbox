import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {NGXLogger} from 'ngx-logger';
import {MaterialViewService} from '../../../material/services/material-view.service';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss'],
})
export class InventoryHeaderComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('inventory');

  constructor(public view: MaterialViewService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
  }
}
