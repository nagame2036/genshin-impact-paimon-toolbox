import {Injectable} from '@angular/core';
import {allRarities, Rarity} from '../../game-common/models/rarity.type';
import {SettingService} from '../../setting/services/setting.service';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {
  defaultMaterialViewOptions,
  MaterialViewOptions,
} from '../models/options.model';
import {MaterialDetail} from '../models/material.model';
import {MaterialType} from '../models/material-type.enum';
import {MaterialService} from './material.service';
import {first, map} from 'rxjs/operators';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';
import {MaterialInfoService} from './material-info.service';

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
    private information: MaterialInfoService,
    private settings: SettingService,
  ) {
    settings
      .get(this.settingKey, defaultMaterialViewOptions)
      .subscribe(options => this.options$.next(options));
  }

  viewDetails(
    details: MaterialDetail[],
    {rarities, showOverflow}: MaterialViewOptions,
  ): MaterialDetail[] {
    const results = [];
    const groups = new Set<number>();
    for (const detail of details) {
      const {info, overflow} = detail;
      if (!rarities.includes(info.rarity) || (overflow && !showOverflow)) {
        continue;
      }
      const group = info.group;
      if (!group) {
        results.push(detail);
        continue;
      }
      if (groups.has(group)) {
        continue;
      }
      groups.add(group);
      const grouped = this.information.grouped.get(group) ?? [];
      for (const {id, rarity} of grouped) {
        if (rarities.includes(rarity)) {
          const groupedDetail = this.materials.materials.get(id);
          if (groupedDetail) {
            results.push(groupedDetail);
          }
        }
      }
    }
    return results.sort(compare);
  }

  viewTypes(types: MaterialType[][]): Observable<MaterialDetail[][]> {
    return combineLatest([this.options, this.materials.updated]).pipe(
      map(([options]) => {
        const results: MaterialDetail[][] = [];
        for (const type of types) {
          const typed: MaterialDetail[] = [];
          for (const subType of type) {
            const subTyped = this.materials.typed.get(subType) ?? [];
            typed.push(...subTyped.values());
          }
          const details = this.viewDetails(typed, options);
          results.push(details);
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
