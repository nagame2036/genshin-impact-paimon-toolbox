import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentGoalSelectComponent} from './current-goal-select.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrentTargetSelectComponent', () => {
  let component: CurrentGoalSelectComponent;
  let fixture: ComponentFixture<CurrentGoalSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentGoalSelectComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
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
