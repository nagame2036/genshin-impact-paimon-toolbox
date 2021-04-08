import {Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../models/item.model';
import {AbstractObservableDirective} from '../../shared/directives/abstract-observable.directive';
import {I18n} from '../../widget/models/i18n.model';
import {Subject} from 'rxjs';
import {ItemViewService} from '../services/item-view.service';
import {NGXLogger} from 'ngx-logger';
import {switchMap, takeUntil} from 'rxjs/operators';

@Directive()
export abstract class InfoGridDirective<T extends Item<T>>
  extends AbstractObservableDirective
  implements OnInit, OnChanges {
  abstract readonly i18n: I18n;

  @Input()
  items: T['info'][] = [];

  itemsView: T['info'][] = [];

  @Input()
  clickText!: string;

  clicked: T['info'] | null = null;

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<T['info']>();

  private updated$ = new Subject();

  protected constructor(public view: ItemViewService<T, any>, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.updated$
      .pipe(
        switchMap(_ => this.view.viewInfos(this.items)),
        takeUntil(this.destroy$),
      )
      .subscribe(items => {
        this.itemsView = items;
      });
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.update();
    }
  }

  update(): void {
    this.updated$.next();
  }

  click(item: T['info']): void {
    this.logger.info('clicked item', item);
    this.clicked = this.clicked === item ? null : item;
    if (this.clicked) {
      this.afterClick(item);
    }
  }

  doubleClick(item: T['info']): void {
    this.logger.info('double clicked item', item);
    this.doubleClicked.emit(item);
  }

  trackItem(index: number, item: T['info']): number {
    return item.id;
  }

  protected afterClick(item: T['info']): void {
  }
}
