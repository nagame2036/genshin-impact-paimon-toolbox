import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggleChange} from '@angular/material/button-toggle';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.sass']
})
export class SettingsPageComponent implements OnInit {

  currentLanguage = this.translator.defaultLang;

  languages: { name: string, value: string }[] = [
    {name: '简体中文', value: 'zh-CN'},
    {name: 'English', value: 'en'},
  ];

  constructor(private translator: TranslateService) {
  }

  ngOnInit(): void {
  }

  changeLanguage($event: MatButtonToggleChange): void {
    this.currentLanguage = $event.value;
    this.translator.use(this.currentLanguage);
  }
}
