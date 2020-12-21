import {Component, OnInit} from '@angular/core';
import {CommonMaterialItem} from '../../../material/models/common-material';
import {CommonMaterialService} from '../../../material/services/common-material.service';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.sass']
})
export class CommonMaterialInventoryComponent implements OnInit {

  items: CommonMaterialItem[] = [];

  constructor(private materials: CommonMaterialService) {
  }

  ngOnInit(): void {
    this.materials.items.subscribe(res => this.items = res);
  }

}
