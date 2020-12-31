import {Component, OnInit} from '@angular/core';
import {CommonMaterialItem} from '../../../material/models/common-material.model';
import {CommonMaterialService} from '../../../material/services/common-material.service';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {partitionArrays} from '../../../shared/utils/collections';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.sass']
})
export class CommonMaterialInventoryComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  mobs: CommonMaterialItem[] = [];

  elites: CommonMaterialItem[] = [];

  constructor(private materials: CommonMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.items.subscribe(res => {
      const [mobs, elites] = partitionArrays(res, [item => item.id < 9000]);
      this.mobs = mobs;
      this.elites = elites;
    });
  }

}
