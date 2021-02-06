import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.scss']
})
export class WeaponMaterialInventoryComponent implements OnInit {

  common$!: Observable<MaterialDetail[]>;

  monThu$!: Observable<MaterialDetail[]>;

  tueFri$!: Observable<MaterialDetail[]>;

  wedSat$!: Observable<MaterialDetail[]>;

  constructor(private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.common$ = this.materials.getTypes(MaterialType.WEAPON_EXP);
    this.monThu$ = this.materials.getTypes(MaterialType.WEAPON_14);
    this.tueFri$ = this.materials.getTypes(MaterialType.WEAPON_25);
    this.wedSat$ = this.materials.getTypes(MaterialType.WEAPON_36);
  }
}
