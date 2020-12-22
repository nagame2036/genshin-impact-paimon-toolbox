import {TestBed} from '@angular/core/testing';

import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PlanModule} from '../plan.module';
import {HttpClientModule} from '@angular/common/http';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {ElementType} from '../../shared/models/element-type.enum';
import {WeaponType} from '../../character-and-gear/models/weapon-type.enum';
import {Ascension} from '../../character-and-gear/models/ascension.enum';

describe('TalentLevelupCostService', () => {
  let service: TalentLevelupCostService;
  let character: PartyCharacter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule
      ]
    });
    service = TestBed.inject(TalentLevelupCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation of amber\'s talent levelup from 1 to 10', done => {
    character = {
      id: 1000,
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
      talents: [
        {id: 10001, level: 1},
      ]
    };
    service.cost(character, [{id: 10001, level: 10}]).subscribe(res => {
      expect(res.mora).toBe(1652500);
      expect(res.talents).toEqual({5000: 3, 5001: 21, 5002: 38});
      expect(res.talentBoss).toEqual({6002: 6});
      expect(res.talentEvent).toEqual({7000: 1});
      expect(res.common).toEqual({8030: 6, 8031: 22, 8032: 31});
      done();
    });
  });

  it('calculation of amber\'s talent levelup from 1 to 6', done => {
    character = {
      id: 1000,
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
      talents: [
        {id: 10001, level: 1},
      ]
    };
    service.cost(character, [{id: 10001, level: 6}]).subscribe(res => {
      expect(res.mora).toBe(122500);
      expect(res.talents).toEqual({5000: 3, 5001: 21});
      expect(res.common).toEqual({8030: 6, 8031: 22});
      done();
    });
  });

  it('calculation of amber\'s talent levelup from 6 to 10', done => {
    character = {
      id: 1000,
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
      talents: [
        {id: 10001, level: 6},
      ]
    };
    service.cost(character, [{id: 10001, level: 10}]).subscribe(res => {
      expect(res.mora).toBe(1530000);
      expect(res.talents).toEqual({5002: 38});
      expect(res.talentBoss).toEqual({6002: 6});
      expect(res.talentEvent).toEqual({7000: 1});
      expect(res.common).toEqual({8032: 31});
      done();
    });
  });

  it('calculation of the traveler\'s talent levelup from 1 to 10', done => {
    character = {
      id: 1,
      rarity: 5,
      element: ElementType.ANEMO,
      weapon: WeaponType.SWORD,
      gem: 300,
      local: 10103,
      common: 802,
      constellation: 0,
      ascension: Ascension.ZERO,
      level: 1,
      talents: [
        {id: 10, level: 1},
      ]
    };
    service.cost(character, [{id: 10, level: 10}]).subscribe(res => {
      expect(res.mora).toBe(1652500);
      expect(res.talents).toEqual({5000: 3, 5001: 6, 5002: 6, 5011: 11, 5012: 12, 5021: 4, 5022: 20});
      expect(res.talentBoss).toEqual({6002: 6});
      expect(res.talentEvent).toEqual({7000: 1});
      expect(res.common).toEqual({8020: 6, 8021: 22, 8022: 31});
      done();
    });
  });
});
