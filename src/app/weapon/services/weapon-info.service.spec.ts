import {TestBed} from '@angular/core/testing';

import {WeaponInfoService} from './weapon-info.service';
import {Weapon} from '../models/weapon.model';
import {WeaponType} from '../models/weapon-type.enum';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';
import {allWeaponAbilities} from '../models/weapon-ability.model';
import {TranslateService} from '@ngx-translate/core';
import {fromIterable} from 'rxjs/internal-compatibility';
import {map, mergeMap} from 'rxjs/operators';

describe('WeaponInfoService', () => {
  let service: WeaponInfoService;
  let translator: TranslateService;
  let weapon: Weapon;

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

  it('calculate weapon stats', () => {
    weapon = {
      info: {
        id: 15502,
        type: WeaponType.BOW,
        rarity: 5,
        materials: {
          domain: 402,
          elite: 902,
          mob: 800,
        },
        stats: {
          'ATK Base': {
            initial: 45.9364013671875,
            curve: 'ATK-301',
          },
          'ATK%': {
            initial: 0.1080000028014183,
            curve: 'CHC-301',
          },
        },
        ability: {
          id: 15502,
          params: [],
        },
      },
      progress: {
        id: 1,
        weaponId: 15502,
        refine: 1,
        ascension: 6,
        level: 90,
      },
      plan: {
        id: 1,
        weaponId: 15502,
        ascension: 6,
        level: 90,
      },
    };
    const stats = service.getStatsValue(weapon.info, weapon.progress);
    expect(stats.get('ATK Base')).toBeCloseTo(608, 0);
    expect(stats.get('ATK%')).toBeCloseTo(0.496, 3);
  });

  it('all weapon abilities description should be correct', done => {
    fromIterable(service.infos.values())
      .pipe(
        mergeMap(info => {
          const {id, params} = info.ability;
          const key = `dict.weapon-abilities.${id}.desc`;
          return translator.get(key).pipe(
            map(descText => {
              const descParams = allWeaponAbilities[id].desc(params[0]);
              let text: string = descText;
              for (const p of descParams) {
                text = text.replace('{}', p);
              }
              console.log(text);
              expect(text.indexOf('{}')).toBe(-1);
            }),
          );
        }),
      )
      .subscribe({complete: () => done()});
  });
});
