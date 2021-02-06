import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {Rarity} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss']
})
export class InventoryHeaderComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('inventory');

  rarityFilter!: number[];

  constructor(public materials: MaterialService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.materials.rarityFilter.pipe(takeUntil(this.destroy$)).subscribe(rarities => {
      this.logger.info('received rarity filter', rarities);
      return this.rarityFilter = rarities;
    });
  }

  changeRarityFilter(rarities: Rarity[]): void {
    this.logger.info('set rarity filter', rarities);
    this.materials.rarityFilter.next(rarities);
  }

}
