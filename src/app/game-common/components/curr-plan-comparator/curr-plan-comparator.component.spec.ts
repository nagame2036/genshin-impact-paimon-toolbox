import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrPlanComparatorComponent} from './curr-plan-comparator.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrPlanComparatorComponent', () => {
  let component: CurrPlanComparatorComponent;
  let fixture: ComponentFixture<CurrPlanComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrPlanComparatorComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrPlanComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
