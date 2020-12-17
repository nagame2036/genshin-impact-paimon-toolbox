import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterListComponent} from './party-character-list.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PartyCharacterListComponent', () => {
  let component: PartyCharacterListComponent;
  let fixture: ComponentFixture<PartyCharacterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyCharacterListComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
