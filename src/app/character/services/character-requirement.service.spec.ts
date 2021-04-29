import {TestBed} from '@angular/core/testing';

import {CharacterRequirementService} from './character-requirement.service';
import {AppTestingModule} from '../../app-testing.module';
import {CharacterModule} from '../character.module';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import itemList from '../../../data/character/character-list.json';
import {CharacterInfo} from '../models/character-info.model';
import {Character} from '../models/character.model';

describe('CharacterRequirementService', () => {
  let service: CharacterRequirementService;
  const info = {...itemList[4000], id: 4000} as CharacterInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(CharacterRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate amber requirement', () => {
    const character: Character = {
      info,
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
    expect(res.getNeed(2006)).toBe(46);
    expect(res.getNeed(3060)).toBe(1);
    expect(res.getNeed(3061)).toBe(9);
    expect(res.getNeed(3062)).toBe(9);
    expect(res.getNeed(3063)).toBe(6);
    expect(res.getNeed(8030)).toBe(18);
    expect(res.getNeed(8031)).toBe(30);
    expect(res.getNeed(8032)).toBe(36);
    expect(res.getNeed(10105)).toBe(168);
  });
});
