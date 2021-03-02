import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialRequirementDialogComponent} from './material-requirement-dialog.component';
import {InventoryModule} from '../../../inventory/inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('MaterialRequirementDialogComponent', () => {
  let component: MaterialRequirementDialogComponent;
  let fixture: ComponentFixture<MaterialRequirementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialRequirementDialogComponent],
      imports: [InventoryModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequirementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
