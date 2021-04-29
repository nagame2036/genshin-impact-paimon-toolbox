// noinspection DuplicatedCode
import {TestBed} from '@angular/core/testing';

import {TalentRequirementService} from './talent-requirement.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';
import {Character} from '../models/character.model';
import {mora} from '../../material/models/mora-and-exp.model';
import {UpgradableTalentInfo} from '../models/talent-info.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import itemList from '../../../data/character/character-list.json';
import {CharacterInfo} from '../models/character-info.model';
import talentList from '../../../data/character/talent-list.json';
import {Ascension} from '../../game-common/models/ascension.type';

describe('TalentRequirementService', () => {
  let service: TalentRequirementService;
  const fullLevelup = {
    progress: {
      id: 1,
      constellation: 0,
      ascension: 6 as Ascension,
      level: 90,
      talents: {
        40000: 1,
      },
    },
    plan: {
      id: 1,
      ascension: 6 as Ascension,
      level: 90,
      talents: {
        40000: 10,
      },
    },
  } as const;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(TalentRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate amber requirement', () => {
    const info = {...itemList[4000], id: 4000} as CharacterInfo;
    const character: Character = {
      info,
      ...fullLevelup,
    };
    const talent: UpgradableTalentInfo = {...talentList[40000], id: 40000};
    const res = new MaterialRequireList(service.requirement(character, [talent]));
    expect(res.getNeed(mora.id)).toBe(1652500);
    expect(res.getNeed(5000)).toBe(3);
    expect(res.getNeed(5001)).toBe(21);
    expect(res.getNeed(5002)).toBe(38);
    expect(res.getNeed(6002)).toBe(6);
    expect(res.getNeed(7000)).toBe(1);
    expect(res.getNeed(8030)).toBe(6);
    expect(res.getNeed(8031)).toBe(22);
    expect(res.getNeed(8032)).toBe(31);
  });

  it('calculate traveler requirement', () => {
    const info = {...itemList[1001], id: 1001} as CharacterInfo;
    const character: Character = {
      info,
      progress: {...fullLevelup.progress, talents: {10010: 1}},
      plan: {...fullLevelup.plan, talents: {10010: 10}},
    };
    const talent: UpgradableTalentInfo = {...talentList[10010], id: 10010};
    const res = new MaterialRequireList(service.requirement(character, [talent]));
    expect(res.getNeed(5000)).toBe(3);
    expect(res.getNeed(5001)).toBe(6);
    expect(res.getNeed(5002)).toBe(6);
    expect(res.getNeed(5011)).toBe(11);
    expect(res.getNeed(5012)).toBe(12);
    expect(res.getNeed(5021)).toBe(4);
    expect(res.getNeed(5022)).toBe(20);
  });
});
