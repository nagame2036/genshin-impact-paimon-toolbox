import {TestBed} from '@angular/core/testing';

import {WeaponInfoService} from './weapon-info.service';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';
import {TranslateService} from '@ngx-translate/core';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {Ascension} from '../../game-common/models/ascension.type';
import itemList from '../../../data/weapon/weapon-list.json';
import {WeaponInfo} from '../models/weapon-info.model';

describe('WeaponInfoService', () => {
  let service: WeaponInfoService;
  let translator: TranslateService;
  const amosInfo = {...itemList[15502], id: 15502} as WeaponInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponInfoService);
    translator = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate Amos Bow stats', () => {
    const progress: AscensionLevel = {ascension: 6, level: 90};
    const stats = service.getStatsValue(amosInfo, progress);
    expect(stats.get('ATK Base')).toBeCloseTo(608, 0);
    expect(stats.get('ATK%')).toBeCloseTo(0.496, 3);
  });

  it('below the ascension bound be NaN', () => {
    const progress: AscensionLevel = {ascension: -10 as Ascension, level: 90};
    const stats = service.getStatsValue(amosInfo, progress);
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('above the ascension bound be NaN', () => {
    const progress: AscensionLevel = {ascension: 100 as Ascension, level: 90};
    const stats = service.getStatsValue(amosInfo, progress);
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('below the level bound be NaN', () => {
    const progress: AscensionLevel = {ascension: 6, level: -100};
    const stats = service.getStatsValue(amosInfo, progress);
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });

  it('above the level bound should be NaN', () => {
    const progress: AscensionLevel = {ascension: 6, level: 1000};
    const stats = service.getStatsValue(amosInfo, progress);
    expect(stats.get('ATK Base')).toBeNaN();
    expect(stats.get('ATK%')).toBeNaN();
  });
});
