import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentGoalComparatorComponent} from './current-goal-comparator.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrentGoalComparatorComponent', () => {
  let component: CurrentGoalComparatorComponent;
  let fixture: ComponentFixture<CurrentGoalComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrentGoalComparatorComponent
      ],
      imports: [
        GameCommonModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGoalComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
