import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialDetailDialogComponent} from './material-detail-dialog.component';
import {InventoryModule} from '../../../inventory/inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('MaterialDetailDialogComponent', () => {
  let component: MaterialDetailDialogComponent;
  let fixture: ComponentFixture<MaterialDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialDetailDialogComponent],
      imports: [InventoryModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
