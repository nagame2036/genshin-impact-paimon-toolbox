import {TestBed} from '@angular/core/testing';

import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {HttpClientModule} from '@angular/common/http';
import {PlanModule} from '../plan.module';
import {PartyCharacter} from '../../character/models/party-character.model';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
import {ElementType} from '../../game-common/models/element-type.enum';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {AppTranslateModule} from '../../app-translate.module';

describe('CharacterLevelupService', () => {
  let service: CharacterLevelupCostService;
  let character: PartyCharacter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule,
        AppTranslateModule,
      ]
    });
    service = TestBed.inject(CharacterLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation of levelup from (0, 1) to (6, 90) with gem = 306 and enemy = 803', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      boss: 2060,
      gem: 306,
      local: 10105,
      mob: 803,
      constellation: 0,
      ascension: 0,
      level: 1,
      skills: [],
      talents: [],
    };
    service.cost(character, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(mora.id)).toBe(2092530);
      expect(res.getAmount(characterExp.id)).toBe(8362650);
      expect(res.getAmount(2060)).toBe(46);
      expect(res.getAmount(3060)).toBe(1);
      expect(res.getAmount(3061)).toBe(9);
      expect(res.getAmount(3062)).toBe(9);
      expect(res.getAmount(3063)).toBe(6);
      expect(res.getAmount(8030)).toBe(18);
      expect(res.getAmount(8031)).toBe(30);
      expect(res.getAmount(8032)).toBe(36);
      expect(res.getAmount(10105)).toBe(168);
      done();
    });
  });

  it('calculation of levelup from (0, 1) to (2, 50) with none elemental and gem = 300 and enemy = 806', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      gem: 300,
      local: 10105,
      mob: 806,
      constellation: 0,
      ascension: 0,
      level: 1,
      skills: [],
      talents: [],
    };
    service.cost(character, new AscensionLevel(2, 50)).subscribe(res => {
      expect(res.getAmount(mora.id)).toBe(315520);
      expect(res.getAmount(characterExp.id)).toBe(1277600);
      expect(res.getAmount(3000)).toBe(1);
      expect(res.getAmount(3001)).toBe(3);
      expect(res.getAmount(8060)).toBe(18);
      expect(res.getAmount(10105)).toBe(13);
      done();
    });
  });

  it('calculation of levelup from (2, 50) to (6, 90) with gem = 303 and enemy = 801', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      boss: 2060,
      gem: 303,
      local: 10105,
      mob: 801,
      constellation: 0,
      ascension: 2,
      level: 50,
      skills: [],
      talents: [],
    };
    service.cost(character, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(mora.id)).toBe(1777010);
      expect(res.getAmount(characterExp.id)).toBe(7085050);
      expect(res.getAmount(2060)).toBe(44);
      expect(res.getAmount(3031)).toBe(6);
      expect(res.getAmount(3032)).toBe(9);
      expect(res.getAmount(3033)).toBe(6);
      expect(res.getAmount(8011)).toBe(30);
      expect(res.getAmount(8012)).toBe(36);
      expect(res.getAmount(10105)).toBe(155);
      done();
    });
  });
});
