import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialType} from '../../../material/models/material-type.enum';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.scss'],
})
export class CharacterMaterialInventoryComponent
  extends AbstractObservableComponent
  implements OnInit {
  common!: MaterialDetail[];

  boss!: MaterialDetail[];

  gem!: MaterialDetail[];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.filtered
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {
        this.common = materials.get(MaterialType.CHARACTER_EXP) ?? [];
        this.boss = materials.get(MaterialType.CHARACTER_BOSS) ?? [];
        this.gem = materials.get(MaterialType.CHARACTER_GEM) ?? [];
      });
  }
}
