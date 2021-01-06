import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {TalentMaterialService} from '../../../material/services/talent-material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {partitionArrays} from '../../../shared/utils/collections';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.sass']
})
export class TalentMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  items$!: Observable<InventoryItem[][]>;

  rarities = [5, 4, 3, 2];

  constructor(private materials: TalentMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.filterItems(this.materials.items).pipe(map(items => partitionArrays(items, [
      item => this.materials.getWeekday(item) === 14,
      item => this.materials.getWeekday(item) === 25,
      item => this.materials.getWeekday(item) === 36,
    ])));
  }
}
