import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ElementalMaterialInventoryComponent} from './elemental-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('ElementalMaterialInventoryComponent', () => {
  let component: ElementalMaterialInventoryComponent;
  let fixture: ComponentFixture<ElementalMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ElementalMaterialInventoryComponent
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
    fixture = TestBed.createComponent(ElementalMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
