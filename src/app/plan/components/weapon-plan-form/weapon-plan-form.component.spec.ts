import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPlanFormComponent} from './weapon-plan-form.component';
import {PlanModule} from '../../plan.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';

describe('WeaponPlanFormComponent', () => {
  let component: WeaponPlanFormComponent;
  let fixture: ComponentFixture<WeaponPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponPlanFormComponent
      ],
      imports: [
        PlanModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPlanFormComponent);
    component = fixture.componentInstance;
    component.weapon = {
      id: 1,
      type: WeaponType.SWORD,
      rarity: 4,
      common: 1,
      domain: 1,
      elite: 1,
      refine: 1,
      ascension: 0,
      level: 1
    };
    component.plan = {
      id: 1,
      ascension: 0,
      level: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
