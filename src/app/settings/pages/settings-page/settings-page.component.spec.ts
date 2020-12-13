import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsPageComponent} from './settings-page.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {SettingsModule} from '../../settings.module';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SettingsPageComponent
      ],
      imports: [
        SettingsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
