import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnemyMaterialInventoryComponent} from './enemy-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('EnemyMaterialInventoryComponent', () => {
  let component: EnemyMaterialInventoryComponent;
  let fixture: ComponentFixture<EnemyMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EnemyMaterialInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
