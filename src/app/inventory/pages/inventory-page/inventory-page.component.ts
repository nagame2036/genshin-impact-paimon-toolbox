import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})
export class InventoryPageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  links = [
    'character-materials',
    'talent-materials',
    'weapon-materials',
    'common-materials',
    'ingredients'
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
