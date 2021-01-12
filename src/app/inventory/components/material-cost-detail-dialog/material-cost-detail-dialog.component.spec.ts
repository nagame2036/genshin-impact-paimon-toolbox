import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialCostDetailDialogComponent} from './material-cost-detail-dialog.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('MaterialCostDetailDialogComponent', () => {
  let component: MaterialCostDetailDialogComponent;
  let fixture: ComponentFixture<MaterialCostDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialCostDetailDialogComponent
      ],
      imports: [
        InventoryModule,
        AppTranslateModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: 0}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCostDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
