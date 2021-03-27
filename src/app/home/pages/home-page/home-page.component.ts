import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  i18n = I18n.create('home');

  constructor() {}

  ngOnInit(): void {}
}
