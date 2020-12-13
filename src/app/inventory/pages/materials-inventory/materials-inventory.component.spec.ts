import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialsInventoryComponent} from './materials-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';

describe('MaterialsInventoryComponent', () => {
  let component: MaterialsInventoryComponent;
  let fixture: ComponentFixture<MaterialsInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialsInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppIndexedDbModule,
        HttpClientModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
