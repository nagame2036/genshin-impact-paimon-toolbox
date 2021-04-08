import {Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../models/item.model';
import {AbstractObservableDirective} from '../../shared/directives/abstract-observable.directive';
import {I18n} from '../../widget/models/i18n.model';
import {ItemViewService} from '../services/item-view.service';
import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {switchMap, takeUntil} from 'rxjs/operators';
import {MultiSelectEvent} from '../models/multi-select-event.model';
import {toggleItem} from '../../shared/utils/collections';

@Directive()
export abstract class ItemGridDirective<T extends Item<T>>
  extends AbstractObservableDirective
  implements OnInit, OnChanges {
  abstract readonly i18n: I18n;

  @Input()
  items: T[] = [];

  itemsView: T[] = [];

  @Input()
  clickText!: string;

  clicked: T | null = null;

  @Input()
  selected: T[] = [];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<T>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<T[]>();

  private updated$ = new Subject();

  protected constructor(public view: ItemViewService<T, any>, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.updated$
      .pipe(
        switchMap(_ => this.view.view(this.items)),
        takeUntil(this.destroy$),
      )
      .subscribe(items => (this.itemsView = items));
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.update();
    }
  }

  update(): void {
    this.logger.info('update items');
    this.updated$.next();
  }

  click(item: T): void {
    this.logger.info('clicked item', item);
    if (!this.multiSelect) {
      this.clicked = this.clicked === item ? null : item;
    } else {
      const id = item.progress.id;
      const list = toggleItem(this.selected, item, it => it.progress.id === id);
      this.selected = list;
      this.clicked = list[list.length - 1] ?? null;
      this.multiSelected.emit(list);
    }
    if (this.clicked) {
      this.afterClick(item);
    }
  }

  doubleClick(item: T): void {
    this.logger.info('double clicked item', item);
    this.doubleClicked.emit(item);
  }

  onMultiSelect({multiSelect, selectAll}: MultiSelectEvent): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selected = selectAll ? this.items : [];
    this.multiSelected.emit(this.selected);
  }

  trackItem(index: number, item: T): number {
    return item.progress.id;
  }

  protected afterClick(item: T): void {
  }
}
