import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Output()
  showMenu = new EventEmitter<MouseEvent>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
