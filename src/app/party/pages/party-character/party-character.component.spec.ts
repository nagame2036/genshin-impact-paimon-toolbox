import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterComponent} from './party-character.component';
import {PartyModule} from '../../party.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';

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
        AppIndexedDbModule,
        AppTranslateModule
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
