import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentGoalLevelSelectComponent} from './current-goal-level-select.component';
import {PlanModule} from '../../plan.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CurrentGoalLevelSelectComponent', () => {
  let component: CurrentGoalLevelSelectComponent;
  let fixture: ComponentFixture<CurrentGoalLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrentGoalLevelSelectComponent
      ],
      imports: [
        PlanModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGoalLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
