import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentGoalLevelSelectComponent} from './current-goal-level-select.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrentGoalLevelSelectComponent', () => {
  let component: CurrentGoalLevelSelectComponent;
  let fixture: ComponentFixture<CurrentGoalLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentGoalLevelSelectComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
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
