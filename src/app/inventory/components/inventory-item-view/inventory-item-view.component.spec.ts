import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryItemViewComponent} from './inventory-item-view.component';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';

describe('InventoryItemViewComponent', () => {
  let component: InventoryItemViewComponent;
  let fixture: ComponentFixture<InventoryItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventoryItemViewComponent
      ],
      imports: [
        HttpClientModule,
        AppIndexedDbModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
