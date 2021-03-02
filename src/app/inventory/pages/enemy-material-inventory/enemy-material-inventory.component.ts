import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-enemy-material-inventory',
  templateUrl: './enemy-material-inventory.component.html',
  styleUrls: ['./enemy-material-inventory.component.scss'],
})
export class EnemyMaterialInventoryComponent
  extends AbstractObservableComponent
  implements OnInit {
  mobs!: MaterialDetail[];

  elites!: MaterialDetail[];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.filtered
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {
        this.mobs = materials.get(MaterialType.ENEMY_MOB) ?? [];
        this.elites = materials.get(MaterialType.ENEMY_ELITE) ?? [];
      });
  }
}
