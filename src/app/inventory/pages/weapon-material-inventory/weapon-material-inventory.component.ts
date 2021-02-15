import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialType} from '../../../material/models/material-type.enum';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.scss']
})
export class WeaponMaterialInventoryComponent extends AbstractObservableComponent implements OnInit {

  common!: MaterialDetail[];

  monThu!: MaterialDetail[];

  tueFri!: MaterialDetail[];

  wedSat!: MaterialDetail[];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.filtered
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {
        this.common = materials.get(MaterialType.WEAPON_EXP) ?? [];
        this.monThu = materials.get(MaterialType.WEAPON_14) ?? [];
        this.tueFri = materials.get(MaterialType.WEAPON_25) ?? [];
        this.wedSat = materials.get(MaterialType.WEAPON_36) ?? [];
      });
  }
}
