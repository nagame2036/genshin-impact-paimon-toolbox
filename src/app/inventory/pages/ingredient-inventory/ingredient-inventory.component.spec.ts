import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientInventoryComponent} from './ingredient-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('IngredientInventoryComponent', () => {
  let component: IngredientInventoryComponent;
  let fixture: ComponentFixture<IngredientInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
