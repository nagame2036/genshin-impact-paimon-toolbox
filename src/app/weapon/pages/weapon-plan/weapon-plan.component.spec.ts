import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPlanComponent} from './weapon-plan.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponPlanComponent', () => {
  let component: WeaponPlanComponent;
  let fixture: ComponentFixture<WeaponPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponPlanComponent
      ],
      imports: [
        WeaponModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
