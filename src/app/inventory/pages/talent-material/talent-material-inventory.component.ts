import {Component, OnInit} from '@angular/core';
import {TalentMaterialItem} from '../../../material/models/talent-material.model';
import {TalentMaterialService} from '../../../material/services/talent-material.service';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.sass']
})
export class TalentMaterialInventoryComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  others: TalentMaterialItem[] = [];

  monThu: TalentMaterialItem[] = [];

  tueFri: TalentMaterialItem[] = [];

  wedSat: TalentMaterialItem[] = [];

  constructor(private materials: TalentMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.partitionWeekday().subscribe(materials => {
      const [monThu, tueFri, wedSat, others] = materials;
      this.others = others;
      this.monThu = monThu;
      this.tueFri = tueFri;
      this.wedSat = wedSat;
    });
  }
}
