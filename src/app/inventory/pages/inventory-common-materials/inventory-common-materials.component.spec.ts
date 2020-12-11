import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryCommonMaterialsComponent} from './inventory-common-materials.component';

describe('InventoryCommonMaterialsComponent', () => {
  let component: InventoryCommonMaterialsComponent;
  let fixture: ComponentFixture<InventoryCommonMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryCommonMaterialsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCommonMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
