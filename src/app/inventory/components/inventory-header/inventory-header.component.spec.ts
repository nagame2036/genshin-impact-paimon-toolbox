import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryHeaderComponent} from './inventory-header.component';
import {InventoryModule} from '../../inventory.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';

describe('InventoryHeaderComponent', () => {
  let component: InventoryHeaderComponent;
  let fixture: ComponentFixture<InventoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventoryHeaderComponent
      ],
      imports: [
        InventoryModule,
        AppIndexedDbModule,
        AppTranslateModule,
        HttpClientModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
