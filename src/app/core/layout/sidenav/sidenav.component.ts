import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.sass']
})
export class SidenavComponent implements OnInit {

  @Input()
  showMenu!: boolean;

  @Input()
  routers!: { path: string, icon: string }[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
