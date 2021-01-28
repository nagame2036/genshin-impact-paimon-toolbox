import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  opened = false;

  @ViewChild('outside')
  outside!: ElementRef;

  constructor(private logger: NGXLogger) {
  }

  ngOnInit(): void {
  }

  open(): void {
    this.opened = true;
    this.logger.info('open');
  }

  close(): void {
    this.opened = false;
    this.logger.info('close');
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (this.outside.nativeElement === event.target) {
      this.opened = false;
    }
  }
}
