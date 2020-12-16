import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemViewComponent} from './item-view.component';
import {InventoryModule} from '../../../inventory/inventory.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('ItemImageContainerComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ItemViewComponent
      ],
      imports: [
        InventoryModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
