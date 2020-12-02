import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'home';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
