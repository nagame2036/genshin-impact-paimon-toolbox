import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPlanFormComponent} from './character-plan-form.component';
import {PartyModule} from '../../party.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';

describe('CharacterPlanFormComponent', () => {
  let component: CharacterPlanFormComponent;
  let fixture: ComponentFixture<CharacterPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPlanFormComponent
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
    fixture = TestBed.createComponent(CharacterPlanFormComponent);
    component = fixture.componentInstance;
    component.character = {
      id: 1,
      weapon: WeaponType.SWORD,
      rarity: 4,
      mob: 1,
      element: 1,
      gem: 1,
      local: 1,
      constellation: 0,
      ascension: 0,
      level: 1,
      skills: [],
      talents: [],
    };
    component.plan = {
      id: 1,
      ascension: 0,
      level: 1,
      talents: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
