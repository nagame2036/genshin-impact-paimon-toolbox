import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  opened = false;

  @Output()
  closed = new EventEmitter();

  @ViewChild('outside')
  outside!: ElementRef;

  constructor(private logger: NGXLogger) {}

  ngOnInit(): void {}

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
  clickOutside(event: Event): void {
    if (this.outside.nativeElement === event.target) {
      this.close();
    }
  }
}
