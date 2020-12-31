import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterDetailFormComponent} from './character-detail-form.component';
import {PartyModule} from '../../party.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {WeaponType} from '../../../character-and-gear/models/weapon-type.enum';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';

describe('CharacterDetailFormComponent', () => {
  let component: CharacterDetailFormComponent;
  let fixture: ComponentFixture<CharacterDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterDetailFormComponent
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
    fixture = TestBed.createComponent(CharacterDetailFormComponent);
    component = fixture.componentInstance;
    component.character = {
      id: 1,
      weapon: WeaponType.SWORD,
      rarity: 4,
      common: 1,
      element: 1,
      gem: 1,
      local: 1,
      constellation: 0,
      ascension: Ascension.ZERO,
      level: 1,
      talents: []
    };
    component.plan = {
      id: 1,
      ascension: Ascension.ZERO,
      level: 1,
      talents: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
