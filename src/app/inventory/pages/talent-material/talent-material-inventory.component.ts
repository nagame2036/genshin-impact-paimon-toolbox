import {Component, OnInit} from '@angular/core';
import {TalentMaterialItem} from '../../../material/models/talent-material.model';
import {TalentMaterialService} from '../../../material/services/talent-material.service';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.sass']
})
export class TalentMaterialInventoryComponent implements OnInit {

  items: TalentMaterialItem[] = [];

  constructor(private materials: TalentMaterialService) {
  }

  ngOnInit(): void {
    this.materials.items.subscribe(res => this.items = res);
  }

}
