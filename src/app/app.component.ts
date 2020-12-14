import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  showMenu = true;

  routers = [
    {path: 'home'},
    {path: 'party'},
    {path: 'character-stat'},
    {path: 'inventory'},
    {path: 'resin'},
  ];
}
