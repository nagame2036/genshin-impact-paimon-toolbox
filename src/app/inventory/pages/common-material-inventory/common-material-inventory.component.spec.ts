import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonMaterialInventoryComponent} from './common-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('CommonMaterialInventoryComponent', () => {
  let component: CommonMaterialInventoryComponent;
  let fixture: ComponentFixture<CommonMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CommonMaterialInventoryComponent
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
    fixture = TestBed.createComponent(CommonMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
