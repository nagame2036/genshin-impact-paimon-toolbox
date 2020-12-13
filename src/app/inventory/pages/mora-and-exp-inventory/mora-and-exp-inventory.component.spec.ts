import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MoraAndExpInventoryComponent} from './mora-and-exp-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('MoraAndExpInventoryComponent', () => {
  let component: MoraAndExpInventoryComponent;
  let fixture: ComponentFixture<MoraAndExpInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MoraAndExpInventoryComponent
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
    fixture = TestBed.createComponent(MoraAndExpInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
