import {TestBed} from '@angular/core/testing';

import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';
import {Character} from '../models/character.model';
import {ElementType} from '../../game-common/models/element-type.enum';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
import {mora} from '../../material/models/mora-and-exp.model';
import {TalentInfo} from '../models/talent-info.model';

describe('TalentLevelupCostService', () => {
  let service: TalentLevelupCostService;
  let character: Character;
  let talent: TalentInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(TalentLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation talent levelup from 1 to 10 with domain 400, mob 800, boss 6002, event 7000', done => {
    character = {
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
          40000,
        ],
        talentsOther: [],
      },
      progress: {
        id: 1,
        constellation: 0,
        ascension: 6,
        level: 90,
        talents: {
          40000: 1,
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
    talent = {
      id: 40000,
      materials: {
        domain: [500],
        mob: 800,
        boss: 6002,
        event: 7000,
      }
    };
    service.requirement(character, [talent]).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(1652500);
      expect(res.getNeed(5000)).toBe(3);
      expect(res.getNeed(5001)).toBe(21);
      expect(res.getNeed(5002)).toBe(38);
      expect(res.getNeed(6002)).toBe(6);
      expect(res.getNeed(7000)).toBe(1);
      expect(res.getNeed(8000)).toBe(6);
      expect(res.getNeed(8001)).toBe(22);
      expect(res.getNeed(8002)).toBe(31);
      done();
    });
  });

  it('calculation talent levelup from 1 to 6 with domain 400, mob 800, boss 6002, event 7000', done => {
    character = {
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
          40000: 1,
        },
      },
      plan: {
        id: 1,
        ascension: 6,
        level: 90,
        talents: {
          40000: 6,
        }
      }
    };
    talent = {
      id: 40000,
      materials: {
        domain: [500],
        mob: 800,
        boss: 6002,
        event: 7000,
      }
    };
    service.requirement(character, [talent]).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(122500);
      expect(res.getNeed(5000)).toBe(3);
      expect(res.getNeed(5001)).toBe(21);
      expect(res.getNeed(8000)).toBe(6);
      expect(res.getNeed(8001)).toBe(22);
      done();
    });
  });

  it('calculation talent levelup from 6 to 10 with domain 400, mob 800, boss 6002, event 7000', done => {
    character = {
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
    talent = {
      id: 40000,
      materials: {
        domain: [500],
        mob: 800,
        boss: 6002,
        event: 7000,
      }
    };
    service.requirement(character, [talent]).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(1530000);
      expect(res.getNeed(5002)).toBe(38);
      expect(res.getNeed(6002)).toBe(6);
      expect(res.getNeed(7000)).toBe(1);
      expect(res.getNeed(8002)).toBe(31);
      done();
    });
  });

  it('calculation talent levelup from 1 to 10 with multiple domain material group', done => {
    character = {
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
          40000: 1,
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
    talent = {
      id: 40000,
      materials: {
        domain: [500, 501, 502],
        mob: 800,
        boss: 6002,
        event: 7000,
      }
    };
    service.requirement(character, [talent]).subscribe(res => {
      expect(res.getNeed(mora.id)).toBe(1652500);
      expect(res.getNeed(5000)).toBe(3);
      expect(res.getNeed(5001)).toBe(6);
      expect(res.getNeed(5002)).toBe(6);
      expect(res.getNeed(5011)).toBe(11);
      expect(res.getNeed(5012)).toBe(12);
      expect(res.getNeed(5021)).toBe(4);
      expect(res.getNeed(5022)).toBe(20);
      expect(res.getNeed(6002)).toBe(6);
      expect(res.getNeed(7000)).toBe(1);
      expect(res.getNeed(8000)).toBe(6);
      expect(res.getNeed(8001)).toBe(22);
      expect(res.getNeed(8002)).toBe(31);
      done();
    });
  });
});
