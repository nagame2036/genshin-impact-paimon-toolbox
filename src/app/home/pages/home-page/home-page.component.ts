import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  i18n = new I18n('home');

  constructor() {
  }

  ngOnInit(): void {
  }

}
