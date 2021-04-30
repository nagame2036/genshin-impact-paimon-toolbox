import {Component} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Location} from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent {
  i18n = I18n.create('error');

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
