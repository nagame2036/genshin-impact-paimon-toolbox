import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item.model';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.sass']
})
export class MaterialListComponent implements OnInit {

  @Input()
  items: InventoryItem[] = [];

  @ContentChild('bottom', {static: false})
  bottomTemplateRef!: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
