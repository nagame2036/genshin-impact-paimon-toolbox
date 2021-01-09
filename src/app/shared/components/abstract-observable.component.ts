import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Component({template: ''})
export abstract class AbstractObservableComponent implements OnDestroy {

  protected destroy$ = new Subject();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
