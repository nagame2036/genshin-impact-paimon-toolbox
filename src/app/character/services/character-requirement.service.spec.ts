import {TestBed} from '@angular/core/testing';

import {CharacterRequirementService} from './character-requirement.service';
import {AppTestingModule} from '../../app-testing.module';
import {CharacterModule} from '../character.module';
import {Character} from '../models/character.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';

describe('CharacterRequirementService', () => {
  let service: CharacterRequirementService;
  let character: Character;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(CharacterRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation of levelup from (0, 1) to (6, 90) with gem = 306 and enemy = 803', () => {
    character = {
      info: {
        id: 1,
        rarity: 4,
        element: 6,
        weapon: 5,
        materials: {
          boss: 2060,
          gem: 306,
          local: 10105,
          mob: 803,
        },
        talents: [],
        stats: {},
        curvesAscension: {},
      },
      progress: {
        id: 1,
        constellation: 0,
        ascension: 0,
        level: 1,
        talents: {},
      },
      plan: {
        id: 1,
        ascension: 6,
        level: 90,
        talents: {},
      },
    };
    const res = new MaterialRequireList(service.requirement(character));
    expect(res.getNeed(mora.id)).toBe(2092530);
    expect(res.getNeed(characterExp.id)).toBe(8362650);
    expect(res.getNeed(2060)).toBe(46);
    expect(res.getNeed(3060)).toBe(1);
    expect(res.getNeed(3061)).toBe(9);
    expect(res.getNeed(3062)).toBe(9);
    expect(res.getNeed(3063)).toBe(6);
    expect(res.getNeed(8030)).toBe(18);
    expect(res.getNeed(8031)).toBe(30);
    expect(res.getNeed(8032)).toBe(36);
    expect(res.getNeed(10105)).toBe(168);
  });

  it('calculation of levelup from (0, 1) to (2, 50) with none boss and gem = 300 and enemy = 806', () => {
    character = {
      info: {
        id: 1,
        rarity: 4,
        element: 6,
        weapon: 5,
        materials: {
          gem: 300,
          local: 10105,
          mob: 806,
        },
        talents: [],
        stats: {},
        curvesAscension: {},
      },
      progress: {
        id: 1,
        constellation: 0,
        ascension: 0,
        level: 1,
        talents: {},
      },
      plan: {
        id: 1,
        ascension: 2,
        level: 50,
        talents: {},
      },
    };
    const res = new MaterialRequireList(service.requirement(character));
    expect(res.getNeed(mora.id)).toBe(315520);
    expect(res.getNeed(characterExp.id)).toBe(1277600);
    expect(res.getNeed(3000)).toBe(1);
    expect(res.getNeed(3001)).toBe(3);
    expect(res.getNeed(8060)).toBe(18);
    expect(res.getNeed(10105)).toBe(13);
  });

  it('calculation of levelup from (2, 50) to (6, 90) with gem = 303 and enemy = 801', () => {
    character = {
      info: {
        id: 1,
        rarity: 4,
        element: 6,
        weapon: 5,
        materials: {
          boss: 2060,
          gem: 303,
          local: 10105,
          mob: 801,
        },
        talents: [],
        stats: {},
        curvesAscension: {},
      },
      progress: {
        id: 1,
        constellation: 0,
        ascension: 2,
        level: 50,
        talents: {},
      },
      plan: {
        id: 1,
        ascension: 6,
        level: 90,
        talents: {},
      },
    };
    const res = new MaterialRequireList(service.requirement(character));
    expect(res.getNeed(mora.id)).toBe(1777010);
    expect(res.getNeed(characterExp.id)).toBe(7085050);
    expect(res.getNeed(2060)).toBe(44);
    expect(res.getNeed(3031)).toBe(6);
    expect(res.getNeed(3032)).toBe(9);
    expect(res.getNeed(3033)).toBe(6);
    expect(res.getNeed(8011)).toBe(30);
    expect(res.getNeed(8012)).toBe(36);
    expect(res.getNeed(10105)).toBe(155);
  });
});
