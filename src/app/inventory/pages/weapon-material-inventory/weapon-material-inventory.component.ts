import {Component, OnInit} from '@angular/core';
import {WeaponMaterialService} from '../../../material/services/weapon-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {combineLatest} from 'rxjs';
import {weaponExp} from '../../../material/models/mora-and-exp.model';
import {TalentMaterialItem} from '../../../material/models/talent-material.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.sass']
})
export class WeaponMaterialInventoryComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  expMaterials: InventoryItem[] = [];

  monThu: TalentMaterialItem[] = [];

  tueFri: TalentMaterialItem[] = [];

  wedSat: TalentMaterialItem[] = [];

  constructor(private exps: WeaponExpMaterialService, private materials: WeaponMaterialService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.exps.items, this.materials.partitionWeekday()])
      .subscribe(([exps, materials]) => {
        this.expMaterials = [weaponExp, ...exps];
        const [monThu, tueFri, wedSat] = materials;
        this.monThu = monThu;
        this.tueFri = tueFri;
        this.wedSat = wedSat;
      });
  }
}
