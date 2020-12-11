import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryCharacterAscensionMaterialsComponent} from './inventory-character-ascension-materials.component';

describe('InventoryCharacterAscensionMaterialsComponent', () => {
  let component: InventoryCharacterAscensionMaterialsComponent;
  let fixture: ComponentFixture<InventoryCharacterAscensionMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryCharacterAscensionMaterialsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCharacterAscensionMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
