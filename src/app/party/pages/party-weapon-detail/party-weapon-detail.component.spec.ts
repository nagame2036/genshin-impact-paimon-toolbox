import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyWeaponDetailComponent} from './party-weapon-detail.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('PartyWeaponDetailComponent', () => {
  let component: PartyWeaponDetailComponent;
  let fixture: ComponentFixture<PartyWeaponDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyWeaponDetailComponent
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
    fixture = TestBed.createComponent(PartyWeaponDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
