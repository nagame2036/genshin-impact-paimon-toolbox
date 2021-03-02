import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialService} from '../../../material/services/material.service';
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

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.filtered
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {
        this.common = materials.get(MaterialType.TALENT_COMMON) ?? [];
        this.monThu = materials.get(MaterialType.TALENT_147) ?? [];
        this.tueFri = materials.get(MaterialType.TALENT_257) ?? [];
        this.wedSat = materials.get(MaterialType.TALENT_367) ?? [];
      });
  }
}
