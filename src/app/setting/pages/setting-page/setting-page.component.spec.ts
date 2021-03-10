import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingPageComponent} from './setting-page.component';
import {AppTestingModule} from '../../../app-testing.module';
import {SettingModule} from '../../setting.module';

describe('SettingsPageComponent', () => {
  let component: SettingPageComponent;
  let fixture: ComponentFixture<SettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingPageComponent],
      imports: [SettingModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
