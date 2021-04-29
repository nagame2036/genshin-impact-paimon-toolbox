import {TestBed} from '@angular/core/testing';

import {WeaponRequirementService} from './weapon-requirement.service';
import {Weapon} from '../models/weapon.model';
import {WeaponModule} from '../weapon.module';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {AppTestingModule} from '../../app-testing.module';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import itemList from '../../../data/weapon/weapon-list.json';
import {WeaponInfo} from '../models/weapon-info.model';

describe('WeaponRequirementService', () => {
  let service: WeaponRequirementService;
  const amosInfo = {...itemList[15502], id: 15502} as WeaponInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate Amos Bow requirement', () => {
    const weapon: Weapon = {
      info: amosInfo,
      progress: {
        id: 10000,
        infoId: 1,
        refine: 1,
        ascension: 0,
        level: 1,
      },
      plan: {
        id: 10000,
        infoId: 1,
        ascension: 6,
        level: 90,
      },
    };
    const res = new MaterialRequireList(service.requirement(weapon));
    console.log(res.entries());
    expect(res.getNeed(mora.id)).toBe(1131445);
    expect(res.getNeed(weaponExp.id)).toBe(9064450);
    expect(res.getNeed(4020)).toBe(5);
    expect(res.getNeed(4021)).toBe(14);
    expect(res.getNeed(4022)).toBe(14);
    expect(res.getNeed(4023)).toBe(6);
    expect(res.getNeed(8000)).toBe(15);
    expect(res.getNeed(8001)).toBe(23);
    expect(res.getNeed(8002)).toBe(27);
    expect(res.getNeed(9030)).toBe(23);
    expect(res.getNeed(9031)).toBe(27);
    expect(res.getNeed(9032)).toBe(41);
  });
});
