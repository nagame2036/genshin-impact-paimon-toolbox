import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input()
  showMenu!: boolean;

  @Input()
  routers!: { path: string }[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
