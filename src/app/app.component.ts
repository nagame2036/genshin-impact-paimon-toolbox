import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  routers = [
    {path: 'home'},
    {path: 'characters'},
    {path: 'weapons'},
    {path: 'inventory'},
    {path: 'resin'},
    {path: 'settings'},
  ];
}
