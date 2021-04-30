import {MaterialViewService} from '../../material/services/material-view.service';
import {MaterialListData} from '../../material/models/material-list-data.model';
import {MaterialType} from '../../material/models/material-type.enum';
import {MaterialDetail} from '../../material/models/material.model';
import {WithOnDestroy} from '../../shared/abstract/on-destroy';
import {Directive, OnInit} from '@angular/core';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class WithInventory extends WithOnDestroy implements OnInit {
  abstract types: MaterialType[][];

  materials: MaterialListData[] = [];

  protected constructor(public view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    this.view
      .viewTypes(this.types)
      .pipe(this.untilDestroy())
      .subscribe(details => (this.materials = this.getMaterials(details)));
  }

  abstract getMaterials(materials: MaterialDetail[][]): MaterialListData[];
}
