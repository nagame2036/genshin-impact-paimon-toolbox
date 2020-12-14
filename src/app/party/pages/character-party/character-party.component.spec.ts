import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPartyComponent} from './character-party.component';
import {PartyModule} from '../../party.module';
import {HttpClientModule} from '@angular/common/http';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('CharacterPartyComponent', () => {
  let component: CharacterPartyComponent;
  let fixture: ComponentFixture<CharacterPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPartyComponent
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
    fixture = TestBed.createComponent(CharacterPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
