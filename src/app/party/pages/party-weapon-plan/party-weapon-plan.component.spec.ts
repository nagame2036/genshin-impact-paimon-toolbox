import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyWeaponPlanComponent} from './party-weapon-plan.component';
import {PartyModule} from '../../party.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('PartyWeaponPlanComponent', () => {
  let component: PartyWeaponPlanComponent;
  let fixture: ComponentFixture<PartyWeaponPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyWeaponPlanComponent
      ],
      imports: [
        PartyModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyWeaponPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
