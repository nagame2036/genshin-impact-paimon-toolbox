import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryWeaponAscensionMaterialsComponent} from './inventory-weapon-ascension-materials.component';

describe('InventoryWeaponAscensionMaterialsComponent', () => {
  let component: InventoryWeaponAscensionMaterialsComponent;
  let fixture: ComponentFixture<InventoryWeaponAscensionMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryWeaponAscensionMaterialsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryWeaponAscensionMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
