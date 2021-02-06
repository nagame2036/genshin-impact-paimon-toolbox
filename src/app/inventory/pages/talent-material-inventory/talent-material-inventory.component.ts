import {Component, OnInit} from '@angular/core';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.scss']
})
export class TalentMaterialInventoryComponent implements OnInit {

  common$!: Observable<MaterialDetail[]>;

  monThu$!: Observable<MaterialDetail[]>;

  tueFri$!: Observable<MaterialDetail[]>;

  wedSat$!: Observable<MaterialDetail[]>;

  constructor(private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.common$ = this.materials.getTypes(MaterialType.TALENT_COMMON);
    this.monThu$ = this.materials.getTypes(MaterialType.TALENT_14);
    this.tueFri$ = this.materials.getTypes(MaterialType.TALENT_25);
    this.wedSat$ = this.materials.getTypes(MaterialType.TALENT_36);
  }
}
