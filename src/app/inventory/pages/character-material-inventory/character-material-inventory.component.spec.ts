import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterMaterialInventoryComponent} from './character-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterMaterialInventoryComponent', () => {
  let component: CharacterMaterialInventoryComponent;
  let fixture: ComponentFixture<CharacterMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterMaterialInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
