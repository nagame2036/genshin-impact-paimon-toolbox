import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'home';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
