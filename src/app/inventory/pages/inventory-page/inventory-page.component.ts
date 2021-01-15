import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})
export class InventoryPageComponent implements OnInit {

  i18n = new I18n('inventory');

  links = [
    'character-materials',
    'talent-materials',
    'weapon-materials',
    'enemies-materials',
    'ingredients'
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
