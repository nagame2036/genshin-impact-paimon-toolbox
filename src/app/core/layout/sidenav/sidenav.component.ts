import {Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  i18n = new I18n('core');

  @Input()
  showMenu!: boolean;

  @Input()
  routers!: {path: string}[];

  constructor() {}

  ngOnInit(): void {}
}
