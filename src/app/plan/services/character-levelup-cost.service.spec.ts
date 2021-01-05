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
      expect(res.getAmount(0)).toBe(2092530);
      expect(res.getAmount(1)).toBe(8362650);
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
      expect(res.getAmount(0)).toBe(315520);
      expect(res.getAmount(1)).toBe(1277600);
      expect(res.getAmount(3000)).toBe(1);
      expect(res.getAmount(3001)).toBe(3);
      expect(res.getAmount(8060)).toBe(18);
      expect(res.getAmount(10105)).toBe(13);
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
      expect(res.getAmount(0)).toBe(1777010);
      expect(res.getAmount(1)).toBe(7085050);
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
