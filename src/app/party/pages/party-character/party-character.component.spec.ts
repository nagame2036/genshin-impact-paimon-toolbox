import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterComponent} from './party-character.component';
import {PartyModule} from '../../party.module';
import {HttpClientModule} from '@angular/common/http';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

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
        HttpClientModule,
        AppIndexedDbModule
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
