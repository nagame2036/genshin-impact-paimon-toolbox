import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponMaterialInventoryComponent} from './weapon-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('WeaponMaterialInventoryComponent', () => {
  let component: WeaponMaterialInventoryComponent;
  let fixture: ComponentFixture<WeaponMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponMaterialInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
