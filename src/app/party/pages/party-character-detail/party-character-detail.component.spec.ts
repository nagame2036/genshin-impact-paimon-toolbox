import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterDetailComponent} from './party-character-detail.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('PartyCharacterDetailComponent', () => {
  let component: PartyCharacterDetailComponent;
  let fixture: ComponentFixture<PartyCharacterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyCharacterDetailComponent
      ],
      imports: [
        PartyModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCharacterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
