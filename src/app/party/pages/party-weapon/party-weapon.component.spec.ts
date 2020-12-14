import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyWeaponComponent} from './party-weapon.component';
import {PartyModule} from '../../party.module';
import {HttpClientModule} from '@angular/common/http';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

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
        HttpClientModule,
        AppIndexedDbModule
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
