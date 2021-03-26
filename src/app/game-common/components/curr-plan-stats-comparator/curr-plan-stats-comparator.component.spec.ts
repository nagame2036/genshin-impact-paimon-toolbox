import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrPlanStatsComparatorComponent} from './curr-plan-stats-comparator.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrPlanStatsComparatorComponent', () => {
  let component: CurrPlanStatsComparatorComponent;
  let fixture: ComponentFixture<CurrPlanStatsComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrPlanStatsComparatorComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrPlanStatsComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
