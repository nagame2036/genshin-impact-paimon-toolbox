import {Component, OnInit} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialType} from '../../../material/models/material-type.enum';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.scss'],
})
export class WeaponMaterialInventoryComponent
  extends AbstractObservableComponent
  implements OnInit {
  common!: MaterialDetail[];

  monThu!: MaterialDetail[];

  tueFri!: MaterialDetail[];

  wedSat!: MaterialDetail[];

  constructor(private view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    const types = [
      [MaterialType.WEAPON_EXP],
      [MaterialType.WEAPON_147],
      [MaterialType.WEAPON_257],
      [MaterialType.WEAPON_367],
    ];
    this.view
      .view(types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([common, monThu, tueFri, wedSat]) => {
        this.common = common;
        this.monThu = monThu;
        this.tueFri = tueFri;
        this.wedSat = wedSat;
      });
  }
}
