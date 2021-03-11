import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialViewService} from '../../../material/services/material-view.service';
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
  mob!: MaterialDetail[];

  elite!: MaterialDetail[];

  constructor(private view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    const types = [[MaterialType.ENEMY_MOB], [MaterialType.ENEMY_ELITE]];
    this.view
      .view(types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([mob, elite]) => {
        this.mob = mob;
        this.elite = elite;
      });
  }
}
