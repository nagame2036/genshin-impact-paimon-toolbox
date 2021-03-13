import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.scss'],
})
export class TalentMaterialInventoryComponent
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
      [MaterialType.TALENT_COMMON],
      [MaterialType.TALENT_147],
      [MaterialType.TALENT_257],
      [MaterialType.TALENT_367],
    ];
    this.view
      .viewTypes(types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([common, monThu, tueFri, wedSat]) => {
        this.common = common;
        this.monThu = monThu;
        this.tueFri = tueFri;
        this.wedSat = wedSat;
      });
  }
}
