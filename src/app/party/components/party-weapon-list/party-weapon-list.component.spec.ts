import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyWeaponListComponent} from './party-weapon-list.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PartyWeaponListComponent', () => {
  let component: PartyWeaponListComponent;
  let fixture: ComponentFixture<PartyWeaponListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyWeaponListComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyWeaponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
