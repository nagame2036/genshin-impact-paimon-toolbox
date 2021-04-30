import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  opened = false;

  @Output()
  closed = new EventEmitter();

  @ViewChild('outside')
  outside!: ElementRef;

  constructor(private logger: NGXLogger) {}

  open(): void {
    this.opened = true;
    this.logger.info('open');
  }

  close(): void {
    if (this.opened) {
      this.opened = false;
      this.logger.info('close');
      this.closed.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside({target}: Event): void {
    if (this.outside.nativeElement === target) {
      this.close();
    }
  }
}
