import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LocalSpecialtyInventoryComponent} from './local-specialty-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('LocalSpecialtyInventoryComponent', () => {
  let component: LocalSpecialtyInventoryComponent;
  let fixture: ComponentFixture<LocalSpecialtyInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LocalSpecialtyInventoryComponent
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
    fixture = TestBed.createComponent(LocalSpecialtyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
