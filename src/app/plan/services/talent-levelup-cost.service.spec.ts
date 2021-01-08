import {TestBed} from '@angular/core/testing';

import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PlanModule} from '../plan.module';
import {HttpClientModule} from '@angular/common/http';
import {PartyCharacter} from '../../character/models/party-character.model';
import {ElementType} from '../../shared/models/element-type.enum';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
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
      expect(res.getAmount(0)).toBe(1652500);
      expect(res.getAmount(5000)).toBe(3);
      expect(res.getAmount(5001)).toBe(21);
      expect(res.getAmount(5002)).toBe(38);
      expect(res.getAmount(6002)).toBe(6);
      expect(res.getAmount(7000)).toBe(1);
      expect(res.getAmount(8030)).toBe(6);
      expect(res.getAmount(8031)).toBe(22);
      expect(res.getAmount(8032)).toBe(31);
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
      expect(res.getAmount(0)).toBe(122500);
      expect(res.getAmount(5000)).toBe(3);
      expect(res.getAmount(5001)).toBe(21);
      expect(res.getAmount(8030)).toBe(6);
      expect(res.getAmount(8031)).toBe(22);
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
      expect(res.getAmount(0)).toBe(1530000);
      expect(res.getAmount(5002)).toBe(38);
      expect(res.getAmount(6002)).toBe(6);
      expect(res.getAmount(7000)).toBe(1);
      expect(res.getAmount(8032)).toBe(31);
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
      expect(res.getAmount(0)).toBe(1652500);
      expect(res.getAmount(5000)).toBe(3);
      expect(res.getAmount(5001)).toBe(6);
      expect(res.getAmount(5002)).toBe(6);
      expect(res.getAmount(5011)).toBe(11);
      expect(res.getAmount(5012)).toBe(12);
      expect(res.getAmount(5021)).toBe(4);
      expect(res.getAmount(5022)).toBe(20);
      expect(res.getAmount(6002)).toBe(6);
      expect(res.getAmount(7000)).toBe(1);
      expect(res.getAmount(8020)).toBe(6);
      expect(res.getAmount(8021)).toBe(22);
      expect(res.getAmount(8022)).toBe(31);
      done();
    });
  });
});
