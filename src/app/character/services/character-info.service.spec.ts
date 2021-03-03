import {TestBed} from '@angular/core/testing';

import {CharacterInfoService} from './character-info.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';
import {Character} from '../models/character.model';

describe('CharacterInfoService', () => {
  let service: CharacterInfoService;
  let character: Character;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(CharacterInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate character stats', () => {
    character = {
      info: {
        id: 4013,
        rarity: 4,
        element: 1,
        weapon: 4,
        nation: 1,
        talentsUpgradable: [40130, 40131, 40134],
        talentsOther: [40135, 40136, 40137],
        materials: {
          boss: 2001,
          gem: 301,
          local: 10103,
          mob: 807,
        },
        stats: {
          'HP Base': {
            initial: 775.0223388671875,
            curve: 'HP-S4',
          },
          'ATK Base': {
            initial: 14.246399879455566,
            curve: 'ATK-S4',
          },
          'DEF Base': {
            initial: 58.941749572753906,
            curve: 'HP-S4',
          },
        },
        curvesAscension: {
          'HP Base': [
            0,
            578.9813842773438,
            990.3628540039062,
            1538.87158203125,
            1950.2530517578125,
            2361.634521484375,
            2773.01611328125,
          ],
          'DEF Base': [
            0,
            44.032501220703125,
            75.3187484741211,
            117.03375244140625,
            148.32000732421875,
            179.6062469482422,
            210.8925018310547,
          ],
          'ATK Base': [
            0,
            10.64303970336914,
            18.2052001953125,
            28.2880802154541,
            35.85023880004883,
            43.41239929199219,
            50.97455978393555,
          ],
          'Anemo DMG%': [
            0,
            0,
            0.05999999865889549,
            0.11999999731779099,
            0.11999999731779099,
            0.18000000715255737,
            0.23999999463558197,
          ],
        },
      },
      progress: {
        id: 1,
        constellation: 1,
        ascension: 6,
        level: 90,
        talents: [],
      },
      plan: {
        id: 1,
        ascension: 6,
        level: 90,
        talents: [],
      },
    };
    const stats = service.getStatsValue(character.info, character.progress);
    expect(stats.get('HP Base')).toBeCloseTo(9244, 0);
    expect(stats.get('ATK Base')).toBeCloseTo(170, 0);
    expect(stats.get('DEF Base')).toBeCloseTo(703, 0);
    expect(stats.get('Anemo DMG%')).toBeCloseTo(0.24, 2);
  });
});
