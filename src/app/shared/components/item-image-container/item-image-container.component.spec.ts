import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemImageContainerComponent} from './item-image-container.component';
import {InventoryModule} from '../../../inventory/inventory.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('ItemImageContainerComponent', () => {
  let component: ItemImageContainerComponent;
  let fixture: ComponentFixture<ItemImageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ItemImageContainerComponent
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
    fixture = TestBed.createComponent(ItemImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
