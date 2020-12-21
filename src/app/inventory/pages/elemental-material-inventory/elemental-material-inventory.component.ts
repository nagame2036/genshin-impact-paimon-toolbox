import {Component, OnInit} from '@angular/core';
import {ElementalMaterialService} from '../../../material/services/elemental-material.service';
import {ElementalMaterialItem} from '../../../material/models/elemental-material.model';

@Component({
  selector: 'app-elemental-material-inventory',
  templateUrl: './elemental-material-inventory.component.html',
  styleUrls: ['./elemental-material-inventory.component.sass']
})
export class ElementalMaterialInventoryComponent implements OnInit {

  items: ElementalMaterialItem[] = [];

  constructor(private materials: ElementalMaterialService) {
  }

  ngOnInit(): void {
    this.materials.items.subscribe(res => this.items = res);
  }

}
