import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {ElementalMaterialService} from '../../../shared/services/elemental-material.service';
import {TalentMaterialService} from '../../../shared/services/talent-material.service';
import {WeaponMaterialService} from '../../../shared/services/weapon-material.service';
import {CommonMaterialService} from '../../../shared/services/common-material.service';
import {LocalSpecialtyService} from '../../../shared/services/local-specialty.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.sass']
})
export class InventoryPageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  pages = [
    {label: 'elemental-materials', items: this.elemental.items},
    {label: 'talent-materials', items: this.talent.items},
    {label: 'weapon-materials', items: this.weapon.items},
    {label: 'common-materials', items: this.common.items},
    {label: 'local-specialties', items: this.localSpecialty.items}
  ];

  constructor(private elemental: ElementalMaterialService, private talent: TalentMaterialService, private weapon: WeaponMaterialService,
              private common: CommonMaterialService, private localSpecialty: LocalSpecialtyService) {
    super();
  }

  ngOnInit(): void {
  }
}
