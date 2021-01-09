import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterComponent} from './party-character.component';
import {PartyModule} from '../../party.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

describe('PartyCharacterComponent', () => {
  let component: PartyCharacterComponent;
  let fixture: ComponentFixture<PartyCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyCharacterComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
