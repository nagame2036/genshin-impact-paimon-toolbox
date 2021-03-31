import {MaterialViewService} from '../../material/services/material-view.service';
import {MaterialListData} from '../../material/models/material-list-data.model';
import {Directive, OnInit} from '@angular/core';
import {AbstractObservableDirective} from '../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';
import {MaterialType} from '../../material/models/material-type.enum';
import {MaterialDetail} from '../../material/models/material.model';

@Directive()
export abstract class AbstractSubInventoryDirective
  extends AbstractObservableDirective
  implements OnInit {
  abstract types: MaterialType[][];

  materials: MaterialListData[] = [];

  protected constructor(private view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    this.view
      .viewTypes(this.types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => (this.materials = this.getMaterials(details)));
  }

  abstract getMaterials(materials: MaterialDetail[][]): MaterialListData[];
}
