import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponDetailFormComponent} from './weapon-detail-form.component';
import {PartyModule} from '../../party.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {WeaponType} from '../../../character-and-gear/models/weapon-type.enum';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';

describe('WeaponDetailFormComponent', () => {
  let component: WeaponDetailFormComponent;
  let fixture: ComponentFixture<WeaponDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponDetailFormComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponDetailFormComponent);
    component = fixture.componentInstance;
    component.weapon = {
      id: 1,
      type: WeaponType.SWORD,
      rarity: 4,
      common: 1,
      domain: 1,
      elite: 1,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    component.plan = {
      id: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
