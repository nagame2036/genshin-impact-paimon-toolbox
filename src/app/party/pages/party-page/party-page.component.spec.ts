import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyPageComponent} from './party-page.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {PartyModule} from '../../party.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('PartyPageComponent', () => {
  let component: PartyPageComponent;
  let fixture: ComponentFixture<PartyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyPageComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
