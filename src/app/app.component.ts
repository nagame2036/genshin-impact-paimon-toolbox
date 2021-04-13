import {Component} from '@angular/core';
import {I18n} from './widget/models/i18n.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  i18n = I18n.create('core');

  routers = [
    {path: 'home'},
    {path: 'characters'},
    {path: 'weapons'},
    {path: 'artifacts'},
    {path: 'inventory'},
    {path: 'resin'},
    {path: 'settings'},
  ];

  showMenu = false;

  year!: string;

  constructor() {
    const startYear = 2021;
    const currYear = new Date().getFullYear();
    this.year = currYear === startYear ? `${startYear}` : `${startYear}-${currYear}`;
  }
}
