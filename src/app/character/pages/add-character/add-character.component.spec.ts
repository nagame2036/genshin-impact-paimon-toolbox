import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCharacterComponent} from './add-character.component';
import {CharacterModule} from '../../character.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AddCharacterComponent', () => {
  let component: AddCharacterComponent;
  let fixture: ComponentFixture<AddCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddCharacterComponent
      ],
      imports: [
        CharacterModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
