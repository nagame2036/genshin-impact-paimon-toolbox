import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss']
})
export class IngredientInventoryComponent implements OnInit {

  common$!: Observable<MaterialDetail[]>;

  local$!: Observable<MaterialDetail[]>;

  constructor(private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.common$ = this.materials.getTypes(MaterialType.CURRENCY, MaterialType.ORE);
    this.local$ = this.materials.getTypes(MaterialType.LOCAL_SPECIALTY);
  }
}
