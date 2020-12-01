import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  showMenu = true;

  routers: { path: string; icon: string }[] = [
    {path: 'home', icon: 'home'},
    {path: 'resin', icon: 'brightness_3'}
  ];
}
