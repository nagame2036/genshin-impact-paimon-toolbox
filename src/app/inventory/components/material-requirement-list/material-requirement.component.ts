import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {ItemList} from '../../models/item-list.model';
import {MaterialService} from '../../services/material.service';
import {MaterialType} from '../../models/material-type.enum';
import {map, switchMap} from 'rxjs/operators';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {Observable} from 'rxjs';
import {I18n} from '../../../widget/models/i18n.model';
import {SelectOption} from '../../../widget/models/select-option.model';

@Component({
  selector: 'app-material-requirement',
  templateUrl: './material-requirement.component.html',
  styleUrls: ['./material-requirement.component.scss']
})
export class MaterialRequirementComponent implements OnInit, OnChanges {

  i18n = new I18n('inventory');

  @Input()
  subtitles!: string[];

  @Input()
  types: MaterialType[][] = [];

  @Input()
  requirements: { text: string, value: Observable<ItemList> }[] = [];

  requirementOptions!: SelectOption[];

  currentIndex = 0;

  details!: Observable<InventoryItemDetail[]>[];

  requireDetails$!: Observable<Observable<InventoryItemDetail[]>[]>;

  constructor(public inventory: InventoryService, private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.details = this.types.map(type => {
      return this.materials.getMaterials(...type).pipe(switchMap(items => this.inventory.getDetails(items)));
    });
    this.requirementOptions = this.requirements.map((it, index) => ({text: it.text, value: index}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('requirements')) {
      this.update();
    }
  }

  changeRequirement(index: number): void {
    this.currentIndex = index;
    this.update();
  }

  private update(): void {
    const requirement = this.requirements[this.currentIndex];
    this.requireDetails$ = requirement.value.pipe(map(req => {
      return this.details.map(details => details.pipe(map(it => selectRequire(it, req))));
    }));
  }
}

function selectRequire(details: InventoryItemDetail[], requirement: ItemList): InventoryItemDetail[] {
  const results: InventoryItemDetail[] = [];
  for (const detail of details) {
    const id = detail.id;
    const need = requirement.getAmount(id);
    if (requirement.has(id) && need > 0) {
      let lack = need - detail.have;
      const craftable = Math.max(0, Math.min(lack, detail.craftable));
      lack = Math.max(0, lack - craftable);
      const overflow = lack <= 0;
      results.push({...detail, need, lack, craftable, overflow});
    }
  }
  return results;
}
