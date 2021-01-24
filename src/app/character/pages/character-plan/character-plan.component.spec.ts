import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPlanComponent} from './character-plan.component';
import {CharacterModule} from '../../character.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('CharacterPlanComponent', () => {
  let component: CharacterPlanComponent;
  let fixture: ComponentFixture<CharacterPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterPlanComponent
      ],
      imports: [
        CharacterModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
