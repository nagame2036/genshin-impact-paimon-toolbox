import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentGoalSelectComponent} from './current-goal-select.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {GameCommonModule} from '../../game-common.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CurrentTargetSelectComponent', () => {
  let component: CurrentGoalSelectComponent;
  let fixture: ComponentFixture<CurrentGoalSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrentGoalSelectComponent
      ],
      imports: [
        GameCommonModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGoalSelectComponent);
    component = fixture.componentInstance;
    component.currentOptions = [];
    component.goalOptions = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
