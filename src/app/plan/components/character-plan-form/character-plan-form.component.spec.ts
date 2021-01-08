import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPlanFormComponent} from './character-plan-form.component';
import {PlanModule} from '../../plan.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';

describe('CharacterPlanFormComponent', () => {
  let component: CharacterPlanFormComponent;
  let fixture: ComponentFixture<CharacterPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPlanFormComponent
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
    fixture = TestBed.createComponent(CharacterPlanFormComponent);
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
