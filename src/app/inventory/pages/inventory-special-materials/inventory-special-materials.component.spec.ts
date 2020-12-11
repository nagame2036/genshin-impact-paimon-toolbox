import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventorySpecialMaterialsComponent} from './inventory-special-materials.component';

describe('InventorySpecialMaterialsComponent', () => {
  let component: InventorySpecialMaterialsComponent;
  let fixture: ComponentFixture<InventorySpecialMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorySpecialMaterialsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySpecialMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
