import {Component} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {MaterialViewService} from '../../../material/services/material-view.service';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss'],
})
export class InventoryHeaderComponent {
  i18n = I18n.create('inventory');

  constructor(public view: MaterialViewService) {}
}
