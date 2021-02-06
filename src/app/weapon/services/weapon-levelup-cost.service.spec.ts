import {TestBed} from '@angular/core/testing';

import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {Weapon} from '../models/weapon.model';
import {WeaponType} from '../models/weapon-type.enum';
import {WeaponModule} from '../weapon.module';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponLevelupCostService', () => {
  let service: WeaponLevelupCostService;
  let weapon: Weapon;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        WeaponModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(WeaponLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Rarity 3 weapon level-up from (0, 1) to (6, 90) with domain 400, elite 900, mob 800', done => {
    weapon = {
      info: {
        id: 1,
        rarity: 3,
        type: WeaponType.SWORD,
        materials: {
          domain: 400,
          elite: 900,
          mob: 800,
        },
        stats: {}
      },
      progress: {
        id: 10000,
        weaponId: 1,
        refine: 1,
        ascension: 0,
        level: 1,
      },
      plan: {
        id: 10000,
        weaponId: 1,
        ascension: 6,
        level: 90,
      },
    };
    service.requirement(weapon).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(503820);
      expect(res.getNeed(weaponExp.id)).toBe(3988200);
      expect(res.getNeed(4000)).toBe(2);
      expect(res.getNeed(4001)).toBe(6);
      expect(res.getNeed(4002)).toBe(6);
      expect(res.getNeed(4003)).toBe(3);
      expect(res.getNeed(8000)).toBe(6);
      expect(res.getNeed(8001)).toBe(10);
      expect(res.getNeed(8002)).toBe(12);
      expect(res.getNeed(9000)).toBe(10);
      expect(res.getNeed(9001)).toBe(12);
      expect(res.getNeed(9002)).toBe(18);
      done();
    });
  });

  it('Rarity 4 weapon level-up from (0, 1) to (2, 50) with domain 404, elite 905, mob 805', done => {
    weapon = {
      info: {
        id: 1,
        rarity: 4,
        type: WeaponType.SWORD,
        materials: {
          domain: 404,
          elite: 905,
          mob: 805,
        },
        stats: {}
      },
      progress: {
        id: 10000,
        weaponId: 1,
        refine: 1,
        ascension: 0,
        level: 1,
      },
      plan: {
        id: 10000,
        weaponId: 1,
        ascension: 2,
        level: 50,
      },
    };
    service.requirement(weapon).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(111485);
      expect(res.getNeed(weaponExp.id)).toBe(914850);
      expect(res.getNeed(4040)).toBe(3);
      expect(res.getNeed(4041)).toBe(3);
      expect(res.getNeed(8050)).toBe(10);
      expect(res.getNeed(9050)).toBe(15);
      done();
    });
  });

  it('Rarity 5 weapon level-up from (2, 50) to (6, 90) with domain 403, elite 904, mon 807', done => {
    weapon = {
      info: {
        id: 1,
        rarity: 5,
        type: WeaponType.SWORD,
        materials: {
          domain: 403,
          elite: 904,
          mob: 807,
        },
        stats: {}
      },
      progress: {
        id: 10000,
        weaponId: 1,
        refine: 1,
        ascension: 2,
        level: 50,
      },
      plan: {
        id: 10000,
        weaponId: 1,
        ascension: 6,
        level: 90,
      },
    };
    service.requirement(weapon).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(964195);
      expect(res.getNeed(weaponExp.id)).toBe(7691950);
      expect(res.getNeed(4031)).toBe(9);
      expect(res.getNeed(4032)).toBe(14);
      expect(res.getNeed(8071)).toBe(23);
      expect(res.getNeed(8072)).toBe(27);
      expect(res.getNeed(9041)).toBe(27);
      expect(res.getNeed(9042)).toBe(41);
      done();
    });
  });
});
