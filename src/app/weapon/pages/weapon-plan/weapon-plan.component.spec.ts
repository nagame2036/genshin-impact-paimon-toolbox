import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPlanComponent} from './weapon-plan.component';
import {WeaponModule} from '../../weapon.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';

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
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
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
