import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyWeaponComponent} from './party-weapon.component';
import {PartyModule} from '../../party.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';

describe('PartyWeaponComponent', () => {
  let component: PartyWeaponComponent;
  let fixture: ComponentFixture<PartyWeaponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyWeaponComponent
      ],
      imports: [
        PartyModule,
        AppIndexedDbModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyWeaponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
