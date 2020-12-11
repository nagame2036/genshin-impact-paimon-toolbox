import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryEnemiesMaterialsComponent} from './inventory-enemies-materials.component';

describe('InventoryEnemiesMaterialsComponent', () => {
  let component: InventoryEnemiesMaterialsComponent;
  let fixture: ComponentFixture<InventoryEnemiesMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryEnemiesMaterialsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEnemiesMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
