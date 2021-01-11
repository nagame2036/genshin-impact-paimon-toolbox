import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialsCostListComponent} from './materials-cost-list.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('MaterialsCostListComponent', () => {
  let component: MaterialsCostListComponent;
  let fixture: ComponentFixture<MaterialsCostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialsCostListComponent
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
    fixture = TestBed.createComponent(MaterialsCostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
