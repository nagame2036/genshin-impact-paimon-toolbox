import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnemiesMaterialInventoryComponent} from './enemies-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('EnemiesMaterialInventoryComponent', () => {
  let component: EnemiesMaterialInventoryComponent;
  let fixture: ComponentFixture<EnemiesMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EnemiesMaterialInventoryComponent
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
    fixture = TestBed.createComponent(EnemiesMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
