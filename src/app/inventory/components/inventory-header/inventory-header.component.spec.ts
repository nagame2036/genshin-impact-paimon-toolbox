import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryHeaderComponent} from './inventory-header.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('InventoryHeaderComponent', () => {
  let component: InventoryHeaderComponent;
  let fixture: ComponentFixture<InventoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryHeaderComponent],
      imports: [InventoryModule, AppTestingModule],
    }).compileComponents();
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
