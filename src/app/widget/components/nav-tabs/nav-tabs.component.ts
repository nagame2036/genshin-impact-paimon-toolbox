import {Component, Input, OnInit} from '@angular/core';

export type NavBarLink = {path: string; text: string};

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent implements OnInit {
  @Input()
  links!: NavBarLink[];

  constructor() {}

  ngOnInit(): void {}
}
