import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPlanFormComponent} from './weapon-plan-form.component';
import {WeaponModule} from '../../weapon.module';
import {WeaponType} from '../../models/weapon-type.enum';
import {AppTestingModule} from '../../../app-testing.module';
import {WeaponStatsValue} from '../../models/weapon-stats.model';

describe('WeaponPlanFormComponent', () => {
  let component: WeaponPlanFormComponent;
  let fixture: ComponentFixture<WeaponPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponPlanFormComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPlanFormComponent);
    component = fixture.componentInstance;
    component.weapon = {
      info: {
        id: 1,
        rarity: 3,
        type: WeaponType.SWORD,
        materials: {
          domain: 404,
          elite: 905,
          mob: 805,
        },
        stats: {},
      },
      progress: {
        id: 10000,
        weaponId: 1,
        refine: 1,
        ascension: 0,
        level: 1,
      },
      plan: {
        id: 10000,
        weaponId: 1,
        ascension: 2,
        level: 50,
      },
      currentStats: new WeaponStatsValue(),
      planStats: new WeaponStatsValue(),
    };
    component.info = component.weapon.info;
    component.progress = component.weapon.progress;
    component.plan = component.weapon.plan;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
