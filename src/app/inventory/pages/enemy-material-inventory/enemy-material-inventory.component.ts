import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-enemy-material-inventory',
  templateUrl: './enemy-material-inventory.component.html',
  styleUrls: ['./enemy-material-inventory.component.scss']
})
export class EnemyMaterialInventoryComponent implements OnInit {

  mobs$!: Observable<MaterialDetail[]>;

  elites$!: Observable<MaterialDetail[]>;

  constructor(private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.mobs$ = this.materials.getTypes(MaterialType.ENEMY_MOB);
    this.elites$ = this.materials.getTypes(MaterialType.ENEMY_ELITE);
  }
}
