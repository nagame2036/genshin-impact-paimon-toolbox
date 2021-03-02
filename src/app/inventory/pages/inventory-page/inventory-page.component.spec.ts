import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InventoryPageComponent} from './inventory-page.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('InventoryPageComponent', () => {
  let component: InventoryPageComponent;
  let fixture: ComponentFixture<InventoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryPageComponent],
      imports: [InventoryModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
