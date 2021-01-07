import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
