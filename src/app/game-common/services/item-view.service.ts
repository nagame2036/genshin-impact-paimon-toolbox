import {Item} from '../models/item.model';
import {SettingService} from '../../setting/services/setting.service';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ItemViewOptions} from '../models/item-view-options.model';

export type ItemSort<T> = (a: T, b: T) => number;

export abstract class ItemViewService<
  T extends Item<any>,
  Options extends ItemViewOptions
> {
  readonly sorts = [...this.sortMap].map(([text]) => ({text, value: text}));

  readonly infoSorts = [...this.infoSortMap].map(([text]) => ({text, value: text}));

  private options$ = new ReplaySubject<Options>(1);

  readonly options = this.options$.asObservable();

  protected constructor(
    private sortMap: Map<string, ItemSort<T>>,
    private infoSortMap: Map<string, ItemSort<T['info']>>,
    private settings: SettingService,
    private settingKey: string,
    private defaultOptions: Omit<Options, 'sort' | 'infoSort'>,
  ) {
    const defaultOptionsValue: ItemViewOptions = {
      ...defaultOptions,
      sort: [this.sorts[0].text],
      infoSort: [this.infoSorts[0].text],
    };
    settings
      .get(this.settingKey, defaultOptionsValue as Options)
      .subscribe(options => this.options$.next(options));
  }

  view(items: T[]): Observable<T[]> {
    return this.useOptions(options =>
      sortItems(
        items.filter(it => this.filterItem(it, options)),
        [...getSorts(this.sortMap, options.sort), (a, b) => b.info.id - a.info.id],
      ),
    );
  }

  viewInfos(infos: T['info'][]): Observable<T['info'][]> {
    return this.useOptions(options =>
      sortItems(
        infos.filter(it => this.filterInfo(it, options)),
        [...getSorts(this.infoSortMap, options.infoSort), (a, b) => b.id - a.id],
      ),
    );
  }

  changeSort(sort: string[]): void {
    this.updateView({sort} as Partial<Options>);
  }

  changeInfoSort(infoSort: string[]): void {
    this.updateView({infoSort} as Partial<Options>);
  }

  protected updateView(update: Partial<Options>): void {
    this.settings.update(this.settingKey, update);
  }

  protected filterItem(item: T, options: Options): boolean {
    return this.filterInfo(item.info, options);
  }

  protected abstract filterInfo(info: T['info'], options: Options): boolean;

  private useOptions<R>(action: (options: Options) => R[]): Observable<R[]> {
    return this.options.pipe(map(options => action(options)));
  }
}

function getSorts<T>(sortMap: Map<string, ItemSort<T>>, values: string[]): ItemSort<T>[] {
  return values.map(it => sortMap.get(it) ?? (() => 0));
}

function sortItems<T>(items: T[], sorts: ItemSort<T>[]): T[] {
  return items.sort((a, b) => sorts.reduce((acc, it) => acc || it(a, b), 0));
}
