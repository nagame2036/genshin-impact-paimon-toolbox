import {Component, Input} from '@angular/core';

export type NavBarLink = {path: string; text: string};

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent {
  @Input()
  links!: NavBarLink[];

  constructor() {}
}
