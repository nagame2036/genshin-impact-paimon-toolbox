import {Directive, OnDestroy} from '@angular/core';
import {MonoTypeOperatorFunction, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class WithOnDestroy implements OnDestroy {
  private onDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  protected untilDestroy<O>(): MonoTypeOperatorFunction<O> {
    return takeUntil<O>(this.onDestroy$);
  }
}
