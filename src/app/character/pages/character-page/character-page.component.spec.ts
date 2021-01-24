import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPageComponent} from './character-page.component';
import {CharacterModule} from '../../character.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

describe('CharacterPageComponent', () => {
  let component: CharacterPageComponent;
  let fixture: ComponentFixture<CharacterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPageComponent
      ],
      imports: [
        CharacterModule,
        BrowserAnimationsModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
