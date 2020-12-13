import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatPageComponent} from './character-stat-page.component';
import {CharacterStatModule} from '../../character-stat.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterStatPageComponent', () => {
  let component: CharacterStatPageComponent;
  let fixture: ComponentFixture<CharacterStatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterStatPageComponent
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
    fixture = TestBed.createComponent(CharacterStatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
