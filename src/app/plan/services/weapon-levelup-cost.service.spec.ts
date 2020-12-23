import {TestBed} from '@angular/core/testing';

import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../../character-and-gear/models/party-weapon.model';
import {WeaponType} from '../../character-and-gear/models/weapon-type.enum';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {PlanModule} from '../plan.module';
import {HttpClientModule} from '@angular/common/http';

describe('WeaponLevelupCostService', () => {
  let service: WeaponLevelupCostService;
  let weapon: PartyWeapon;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule
      ]
    });
    service = TestBed.inject(WeaponLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Rarity 3 weapon level-up from (0, 1) to (6, 90) with domain 400, elite 900, common 800', done => {
    weapon = {
      id: 1,
      rarity: 3,
      type: WeaponType.SWORD,
      domain: 400,
      elite: 900,
      common: 800,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(503820);
      expect(res.weaponExp).toBe(3988200);
      expect(res.weaponExpItems).toEqual({200: 1, 201: 4, 202: 398});
      expect(res.weapons).toEqual({4000: 2, 4001: 6, 4002: 6, 4003: 3});
      expect(res.common).toEqual({8000: 6, 8001: 10, 8002: 12, 9000: 10, 9001: 12, 9002: 18});
      done();
    });
  });

  it('Rarity 3 weapon level-up from (0, 1) to (2, 50) with domain 401, elite 902, common 801', done => {
    weapon = {
      id: 1,
      rarity: 3,
      type: WeaponType.SWORD,
      domain: 401,
      elite: 902,
      common: 801,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.TWO, 50)).subscribe(res => {
      expect(res.mora).toBe(75382);
      expect(res.weaponExp).toBe(603825);
      expect(res.weaponExpItems).toEqual({200: 5, 201: 1, 202: 60});
      expect(res.weapons).toEqual({4010: 2, 4011: 2});
      expect(res.common).toEqual({8010: 6, 9020: 10});
      done();
    });
  });

  it('Rarity 3 weapon level-up from (2, 50) to (6, 90) with domain 402, elite 903, common 802', done => {
    weapon = {
      id: 1,
      rarity: 3,
      type: WeaponType.SWORD,
      domain: 402,
      elite: 903,
      common: 802,
      refine: 1,
      ascension: Ascension.TWO,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(428437);
      expect(res.weaponExp).toBe(3384375);
      expect(res.weaponExpItems).toEqual({200: 1, 201: 2, 202: 338});
      expect(res.weapons).toEqual({4021: 4, 4022: 6, 4023: 3});
      expect(res.common).toEqual({8021: 10, 8022: 12, 9031: 12, 9032: 18});
      done();
    });
  });

  it('Rarity 4 weapon level-up from (0, 1) to (6, 90) with domain 403, elite 904, common 803', done => {
    weapon = {
      id: 1,
      rarity: 4,
      type: WeaponType.SWORD,
      domain: 403,
      elite: 904,
      common: 803,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(754265);
      expect(res.weaponExp).toBe(6042650);
      expect(res.weaponExpItems).toEqual({200: 2, 201: 1, 202: 604});
      expect(res.weapons).toEqual({4030: 3, 4031: 9, 4032: 9, 4033: 4});
      expect(res.common).toEqual({8030: 10, 8031: 15, 8032: 18, 9040: 15, 9041: 18, 9042: 27});
      done();
    });
  });

  it('Rarity 4 weapon level-up from (0, 1) to (2, 50) with domain 404, elite 905, common 805', done => {
    weapon = {
      id: 1,
      rarity: 4,
      type: WeaponType.SWORD,
      domain: 404,
      elite: 905,
      common: 805,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.TWO, 50)).subscribe(res => {
      expect(res.mora).toBe(111485);
      expect(res.weaponExp).toBe(914850);
      expect(res.weaponExpItems).toEqual({200: 3, 201: 2, 202: 91});
      expect(res.weapons).toEqual({4040: 3, 4041: 3});
      expect(res.common).toEqual({8050: 10, 9050: 15});
      done();
    });
  });

  it('Rarity 4 weapon level-up from (2, 50) to (6, 90) with domain 405, elite 906, common 806', done => {
    weapon = {
      id: 1,
      rarity: 4,
      type: WeaponType.SWORD,
      domain: 405,
      elite: 906,
      common: 806,
      refine: 1,
      ascension: Ascension.TWO,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(642780);
      expect(res.weaponExp).toBe(5127800);
      expect(res.weaponExpItems).toEqual({200: 5, 201: 3, 202: 512});
      expect(res.weapons).toEqual({4051: 6, 4052: 9, 4053: 4});
      expect(res.common).toEqual({8061: 15, 8062: 18, 9061: 18, 9062: 27});
      done();
    });
  });

  it('Rarity 5 weapon level-up from (0, 1) to (6, 90) with domain 403, elite 904, common 807', done => {
    weapon = {
      id: 1,
      rarity: 5,
      type: WeaponType.SWORD,
      domain: 403,
      elite: 904,
      common: 807,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(1131445);
      expect(res.weaponExp).toBe(9064450);
      expect(res.weaponExpItems).toEqual({200: 2, 201: 2, 202: 906});
      expect(res.weapons).toEqual({4030: 5, 4031: 14, 4032: 14, 4033: 6});
      expect(res.common).toEqual({8070: 15, 8071: 23, 8072: 27, 9040: 23, 9041: 27, 9042: 41});
      done();
    });
  });

  it('Rarity 5 weapon level-up from (0, 1) to (2, 50) with domain 403, elite 904, common 807', done => {
    weapon = {
      id: 1,
      rarity: 5,
      type: WeaponType.SWORD,
      domain: 403,
      elite: 904,
      common: 807,
      refine: 1,
      ascension: Ascension.ZERO,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(Ascension.TWO, 50)).subscribe(res => {
      expect(res.mora).toBe(167250);
      expect(res.weaponExp).toBe(1372500);
      expect(res.weaponExpItems).toEqual({200: 2, 201: 1, 202: 137});
      expect(res.weapons).toEqual({4030: 5, 4031: 5});
      expect(res.common).toEqual({8070: 15, 9040: 23});
      done();
    });
  });

  it('Rarity 5 weapon level-up from (2, 50) to (6, 90) with domain 403, elite 904, common 807', done => {
    weapon = {
      id: 1,
      rarity: 5,
      type: WeaponType.SWORD,
      domain: 403,
      elite: 904,
      common: 807,
      refine: 1,
      ascension: Ascension.TWO,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(Ascension.SIX, 90)).subscribe(res => {
      expect(res.mora).toBe(964195);
      expect(res.weaponExp).toBe(7691950);
      expect(res.weaponExpItems).toEqual({200: 5, 201: 0, 202: 769});
      expect(res.weapons).toEqual({4031: 9, 4032: 14, 4033: 6});
      expect(res.common).toEqual({8071: 23, 8072: 27, 9041: 27, 9042: 41});
      done();
    });
  });
});
