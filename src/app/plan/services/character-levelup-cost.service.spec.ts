import {TestBed} from '@angular/core/testing';

import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {HttpClientModule} from '@angular/common/http';
import {PlanModule} from '../plan.module';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {WeaponType} from '../../character-and-gear/models/weapon-type.enum';
import {ElementType} from '../../shared/models/element-type.enum';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';

describe('CharacterLevelupService', () => {
  let service: CharacterLevelupCostService;
  let character: PartyCharacter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule
      ]
    });
    service = TestBed.inject(CharacterLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation of levelup from (0, 1) to (6, 90) with gem = 306 and common = 803', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      elemental: 2060,
      gem: 306,
      local: 10105,
      common: 803,
      constellation: 0,
      ascension: Ascension.ZERO,
      level: 1,
      talents: []
    };
    service.cost(character, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(2092530);
      expect(res.characterExp).toBe(8362650);
      expect(res.elements[2060]).toBe(46);
      expect(res.gems).toEqual({3060: 1, 3061: 9, 3062: 9, 3063: 6});
      expect(res.common).toEqual({8030: 18, 8031: 30, 8032: 36});
      expect(res.localSpecialties[10105]).toBe(168);
      done();
    });
  });

  it('calculation of levelup from (0, 1) to (2, 50) with none elemental and gem = 300 and common = 806', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      gem: 300,
      local: 10105,
      common: 806,
      constellation: 0,
      ascension: Ascension.ZERO,
      level: 1,
      talents: []
    };
    service.cost(character, new AscensionLevel(Ascension.TWO, 50)).subscribe(res => {
      expect(res.mora).toBe(315520);
      expect(res.characterExp).toBe(1277600);
      expect(res.gems).toEqual({3000: 1, 3001: 3});
      expect(res.common).toEqual({8060: 18});
      expect(res.localSpecialties[10105]).toBe(13);
      done();
    });
  });

  it('calculation of levelup from (2, 50) to (6, 90) with gem = 303 and common = 801', done => {
    character = {
      id: 1,
      rarity: 4,
      element: ElementType.PYRO,
      weapon: WeaponType.BOW,
      elemental: 2060,
      gem: 303,
      local: 10105,
      common: 801,
      constellation: 0,
      ascension: Ascension.TWO,
      level: 50,
      talents: []
    };
    service.cost(character, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(1777010);
      expect(res.characterExp).toBe(7085050);
      expect(res.elements[2060]).toBe(44);
      expect(res.gems).toEqual({3031: 6, 3032: 9, 3033: 6});
      expect(res.common).toEqual({8011: 30, 8012: 36});
      expect(res.localSpecialties[10105]).toBe(155);
      done();
    });
  });
});
