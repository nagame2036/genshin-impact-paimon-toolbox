import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.scss']
})
export class CharacterMaterialInventoryComponent implements OnInit {

  common$!: Observable<MaterialDetail[]>;

  boss$!: Observable<MaterialDetail[]>;

  gem$!: Observable<MaterialDetail[]>;

  constructor(private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.common$ = this.materials.getTypes(MaterialType.CHARACTER_EXP);
    this.boss$ = this.materials.getTypes(MaterialType.CHARACTER_BOSS);
    this.gem$ = this.materials.getTypes(MaterialType.CHARACTER_GEM);
  }
}
