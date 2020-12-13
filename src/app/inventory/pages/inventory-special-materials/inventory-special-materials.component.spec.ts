import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventorySpecialMaterialsComponent} from './inventory-special-materials.component';
import {InventoryModule} from '../../inventory.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';

describe('InventorySpecialMaterialsComponent', () => {
  let component: InventorySpecialMaterialsComponent;
  let fixture: ComponentFixture<InventorySpecialMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventorySpecialMaterialsComponent
      ],
      imports: [
        InventoryModule,
        AppIndexedDbModule,
        HttpClientModule
      ]
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
