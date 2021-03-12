import {Injectable} from '@angular/core';
import {allRarities, Rarity} from '../../game-common/models/rarity.type';
import {SettingService} from '../../setting/services/setting.service';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialViewOptions} from '../models/material-view-options.model';
import {MaterialDetail} from '../models/material.model';
import {MaterialType} from '../models/material-type.enum';
import {MaterialService} from './material.service';
import {first, map} from 'rxjs/operators';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialViewService {
  private readonly settingKey = 'material-view';

  readonly rarities = allRarities.map(it => ({value: it, text: `★${it}`}));

  private options$ = new ReplaySubject<MaterialViewOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(
    private materials: MaterialService,
    private settings: SettingService,
  ) {
    settings
      .get(this.settingKey, {
        rarities: [...allRarities],
        showOverflow: true,
      })
      .subscribe(options => this.options$.next(options));
  }

  view(types: MaterialType[][]): Observable<MaterialDetail[][]> {
    return combineLatest([this.options, this.materials.updated]).pipe(
      map(([options]) => {
        const results: MaterialDetail[][] = [];
        const {rarities, showOverflow} = options;
        const typedMaterials = this.materials.typed;
        for (const type of types) {
          const typed: MaterialDetail[] = [];
          for (const subType of type) {
            const subTyped = typedMaterials.get(subType);
            if (!subTyped) {
              continue;
            }
            for (const detail of subTyped.values()) {
              const {info, overflow} = detail;
              const rarity = info.rarity;
              if (rarities.includes(rarity) && (!overflow || showOverflow)) {
                typed.push(detail);
              }
            }
          }
          typed.sort(compare);
          results.push(typed);
        }
        return results;
      }),
    );
  }

  changeRarity(rarities: Rarity[]): void {
    this.updateView({rarities});
  }

  changeShowOverflow(showOverflow: boolean): void {
    this.updateView({showOverflow});
  }

  private updateView(update: Partial<MaterialViewOptions>): void {
    this.options.pipe(first()).subscribe(options => {
      const newOptions = {...options, ...update};
      this.settings.set(this.settingKey, newOptions);
    });
  }
}

/**
 * Materials id which has prior order in view.
 */
const prior = [mora.id, characterExp.id, weaponExp.id];

function compare({info: a}: MaterialDetail, {info: b}: MaterialDetail): number {
  return (
    prior.indexOf(b.id) - prior.indexOf(a.id) ||
    (a.group ?? 0) - (b.group ?? 0) ||
    b.rarity - a.rarity
  );
}
