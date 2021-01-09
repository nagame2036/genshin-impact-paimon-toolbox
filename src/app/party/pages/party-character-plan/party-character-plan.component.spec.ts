import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyCharacterPlanComponent} from './party-character-plan.component';
import {PartyModule} from '../../party.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('PartyCharacterPlanComponent', () => {
  let component: PartyCharacterPlanComponent;
  let fixture: ComponentFixture<PartyCharacterPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PartyCharacterPlanComponent
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
    fixture = TestBed.createComponent(PartyCharacterPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
