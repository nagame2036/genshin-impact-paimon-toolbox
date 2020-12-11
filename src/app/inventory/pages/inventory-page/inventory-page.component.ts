import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.sass']
})
export class InventoryPageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}