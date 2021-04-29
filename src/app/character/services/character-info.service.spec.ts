import {TestBed} from '@angular/core/testing';

import {CharacterInfoService} from './character-info.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';
import itemList from '../../../data/character/character-list.json';
import {CharacterInfo} from '../models/character-info.model';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {Ascension} from '../../game-common/models/ascension.type';

describe('CharacterInfoService', () => {
  let service: CharacterInfoService;
  const amberInfo = {...itemList[4000], id: 4000} as CharacterInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(CharacterInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate amber stats', () => {
    const progress: AscensionLevel = {ascension: 6, level: 90};
    const stats = service.getStatsValue(amberInfo, progress);
    expect(stats.get('HP Base')).toBeCloseTo(9461, 0);
    expect(stats.get('ATK Base')).toBeCloseTo(223, 0);
    expect(stats.get('DEF Base')).toBeCloseTo(601, 0);
    expect(stats.get('ATK%')).toBeCloseTo(0.24, 2);
  });

  it('below the ascension bound be NaN', () => {
    const progress: AscensionLevel = {ascension: -10 as Ascension, level: 90};
    const stats = service.getStatsValue(amberInfo, progress);
    expect(stats.get('HP Base')).toBeNaN();
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('DEF Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('above the ascension bound be NaN', () => {
    const progress: AscensionLevel = {ascension: 100 as Ascension, level: 90};
    const stats = service.getStatsValue(amberInfo, progress);
    expect(stats.get('HP Base')).toBeNaN();
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('DEF Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('below the level bound be NaN', () => {
    const progress: AscensionLevel = {ascension: 6, level: -100};
    const stats = service.getStatsValue(amberInfo, progress);
    expect(stats.get('HP Base')).toBeNaN();
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('DEF Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('above the level bound should be NaN', () => {
    const progress: AscensionLevel = {ascension: 6, level: 1000};
    const stats = service.getStatsValue(amberInfo, progress);
    expect(stats.get('HP Base')).toBeNaN();
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('DEF Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });
});
