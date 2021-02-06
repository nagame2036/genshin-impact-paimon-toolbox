import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TalentMaterialInventoryComponent} from './talent-material-inventory.component';
import {InventoryModule} from '../../inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('TalentMaterialInventoryComponent', () => {
  let component: TalentMaterialInventoryComponent;
  let fixture: ComponentFixture<TalentMaterialInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TalentMaterialInventoryComponent
      ],
      imports: [
        InventoryModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentMaterialInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
