import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  opened = false;

  @ViewChild('outside')
  outside!: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (this.outside.nativeElement === event.target) {
      this.opened = false;
    }
  }
}
