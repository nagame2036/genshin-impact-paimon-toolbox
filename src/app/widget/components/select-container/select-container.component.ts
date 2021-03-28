import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-select-container',
  templateUrl: './select-container.component.html',
  styleUrls: ['./select-container.component.scss'],
})
export class SelectContainerComponent implements OnInit {
  @Input()
  customDropdown!: TemplateRef<any>;

  @Input()
  valueText!: string;

  hover = false;

  focus = false;

  @Input()
  opened = false;

  constructor(private self: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('window:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
      this.focus = false;
    }
  }
}
