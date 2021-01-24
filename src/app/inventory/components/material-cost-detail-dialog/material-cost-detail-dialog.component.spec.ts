import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialCostDetailDialogComponent} from './material-cost-detail-dialog.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';

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
