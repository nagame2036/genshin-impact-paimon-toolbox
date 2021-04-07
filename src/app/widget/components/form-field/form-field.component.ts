import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements AfterViewInit {
  @ViewChild('container', {static: true})
  private container!: ElementRef;

  width = 0;

  @Input()
  label = '';

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const width = this.container?.nativeElement.offsetWidth;
      this.width = width ?? 0;
    }, 10);
  }
}
