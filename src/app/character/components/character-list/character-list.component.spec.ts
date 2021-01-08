import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterListComponent} from './character-list.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {CharacterModule} from '../../character.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterListComponent
      ],
      imports: [
        CharacterModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
