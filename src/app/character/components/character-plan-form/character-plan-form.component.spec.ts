import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPlanFormComponent} from './character-plan-form.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';
import {ElementType} from '../../../game-common/models/element-type.enum';

describe('CharacterPlanFormComponent', () => {
  let component: CharacterPlanFormComponent;
  let fixture: ComponentFixture<CharacterPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPlanFormComponent
      ],
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPlanFormComponent);
    component = fixture.componentInstance;
    component.character = {
      info: {
        id: 1,
        rarity: 4,
        element: ElementType.PYRO,
        weapon: WeaponType.BOW,
        materials: {
          boss: 2060,
          gem: 303,
          local: 10105,
          mob: 801,
        },
        talentsUpgradable: [
          4000,
        ],
        talentsOther: [],
      },
      progress: {
        id: 1,
        constellation: 0,
        ascension: 6,
        level: 90,
        talents: {
          40000: 6,
        },
      },
      plan: {
        id: 1,
        ascension: 6,
        level: 90,
        talents: {
          40000: 10,
        }
      }
    };
    component.info = component.character.info;
    component.progress = component.character.progress;
    component.plan = component.character.plan;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
