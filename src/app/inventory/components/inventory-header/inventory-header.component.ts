import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {InventoryService} from '../../services/inventory.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss']
})
export class InventoryHeaderComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('inventory');

  rarityFilter!: number[];

  constructor(public inventory: InventoryService) {
    super();
  }

  ngOnInit(): void {
    this.inventory.rarityFilter.pipe(takeUntil(this.destroy$)).subscribe(it => this.rarityFilter = it);
  }

  changeRarityFilter(rarities: number[]): void {
    this.inventory.setRarityFilter(rarities);
  }

}
