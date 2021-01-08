import {TestBed} from '@angular/core/testing';

import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../../weapon/models/party-weapon.model';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(503820);
      expect(res.getAmount(2)).toBe(3988200);
      expect(res.getAmount(4000)).toBe(2);
      expect(res.getAmount(4001)).toBe(6);
      expect(res.getAmount(4002)).toBe(6);
      expect(res.getAmount(4003)).toBe(3);
      expect(res.getAmount(8000)).toBe(6);
      expect(res.getAmount(8001)).toBe(10);
      expect(res.getAmount(8002)).toBe(12);
      expect(res.getAmount(9000)).toBe(10);
      expect(res.getAmount(9001)).toBe(12);
      expect(res.getAmount(9002)).toBe(18);
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(2, 50)).subscribe(res => {
      expect(res.getAmount(0)).toBe(75383);
      expect(res.getAmount(2)).toBe(603825);
      expect(res.getAmount(4010)).toBe(2);
      expect(res.getAmount(4011)).toBe(2);
      expect(res.getAmount(8010)).toBe(6);
      expect(res.getAmount(9020)).toBe(10);
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
      ascension: 2,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(428438);
      expect(res.getAmount(2)).toBe(3384375);
      expect(res.getAmount(4021)).toBe(4);
      expect(res.getAmount(4022)).toBe(6);
      expect(res.getAmount(4023)).toBe(3);
      expect(res.getAmount(8021)).toBe(10);
      expect(res.getAmount(8022)).toBe(12);
      expect(res.getAmount(9031)).toBe(12);
      expect(res.getAmount(9032)).toBe(18);
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(754265);
      expect(res.getAmount(2)).toBe(6042650);
      expect(res.getAmount(4030)).toBe(3);
      expect(res.getAmount(4031)).toBe(9);
      expect(res.getAmount(4032)).toBe(9);
      expect(res.getAmount(4033)).toBe(4);
      expect(res.getAmount(8030)).toBe(10);
      expect(res.getAmount(8031)).toBe(15);
      expect(res.getAmount(8032)).toBe(18);
      expect(res.getAmount(9040)).toBe(15);
      expect(res.getAmount(9041)).toBe(18);
      expect(res.getAmount(9042)).toBe(27);
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(2, 50)).subscribe(res => {
      expect(res.getAmount(0)).toBe(111485);
      expect(res.getAmount(2)).toBe(914850);
      expect(res.getAmount(4040)).toBe(3);
      expect(res.getAmount(4041)).toBe(3);
      expect(res.getAmount(8050)).toBe(10);
      expect(res.getAmount(9050)).toBe(15);
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
      ascension: 2,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(642780);
      expect(res.getAmount(2)).toBe(5127800);
      expect(res.getAmount(4051)).toBe(6);
      expect(res.getAmount(4052)).toBe(9);
      expect(res.getAmount(4053)).toBe(4);
      expect(res.getAmount(8061)).toBe(15);
      expect(res.getAmount(8062)).toBe(18);
      expect(res.getAmount(9061)).toBe(18);
      expect(res.getAmount(9062)).toBe(27);
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(1131445);
      expect(res.getAmount(2)).toBe(9064450);
      expect(res.getAmount(4030)).toBe(5);
      expect(res.getAmount(4031)).toBe(14);
      expect(res.getAmount(4032)).toBe(14);
      expect(res.getAmount(4033)).toBe(6);
      expect(res.getAmount(8070)).toBe(15);
      expect(res.getAmount(8071)).toBe(23);
      expect(res.getAmount(8072)).toBe(27);
      expect(res.getAmount(9040)).toBe(23);
      expect(res.getAmount(9041)).toBe(27);
      expect(res.getAmount(9042)).toBe(41);
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
      ascension: 0,
      level: 1
    };
    service.cost(weapon, new AscensionLevel(2, 50)).subscribe(res => {
      expect(res.getAmount(0)).toBe(167250);
      expect(res.getAmount(2)).toBe(1372500);
      expect(res.getAmount(4030)).toBe(5);
      expect(res.getAmount(4031)).toBe(5);
      expect(res.getAmount(8070)).toBe(15);
      expect(res.getAmount(9040)).toBe(23);
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
      ascension: 2,
      level: 50
    };
    service.cost(weapon, new AscensionLevel(6, 90)).subscribe(res => {
      expect(res.getAmount(0)).toBe(964195);
      expect(res.getAmount(2)).toBe(7691950);
      expect(res.getAmount(4031)).toBe(9);
      expect(res.getAmount(4032)).toBe(14);
      expect(res.getAmount(8071)).toBe(23);
      expect(res.getAmount(8072)).toBe(27);
      expect(res.getAmount(9041)).toBe(27);
      expect(res.getAmount(9042)).toBe(41);
      done();
    });
  });
});
