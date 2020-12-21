import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.sass']
})
export class MaterialListComponent implements OnInit {

  @Input()
  items: InventoryItem[] | null = [];

  @ContentChild('bottom', {static: false})
  bottomTemplateRef!: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
