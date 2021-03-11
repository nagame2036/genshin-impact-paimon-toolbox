import {Component, OnInit} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
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

  constructor(private view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    const types = [
      [MaterialType.CHARACTER_EXP],
      [MaterialType.CHARACTER_BOSS],
      [MaterialType.CHARACTER_GEM],
    ];
    this.view
      .view(types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([common, boss, gem]) => {
        this.common = common;
        this.boss = boss;
        this.gem = gem;
      });
  }
}
