import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrPlanLevelSelectComponent} from './curr-plan-level-select.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrPlanLevelSelectComponent', () => {
  let component: CurrPlanLevelSelectComponent;
  let fixture: ComponentFixture<CurrPlanLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrPlanLevelSelectComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrPlanLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
