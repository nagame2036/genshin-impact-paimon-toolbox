import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatProfileComponent} from './character-stat-profile.component';
import {CharacterStatModule} from '../../character-stat.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterStatProfileComponent', () => {
  let component: CharacterStatProfileComponent;
  let fixture: ComponentFixture<CharacterStatProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterStatProfileComponent
      ],
      imports: [
        CharacterStatModule,
        AppTranslateModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
