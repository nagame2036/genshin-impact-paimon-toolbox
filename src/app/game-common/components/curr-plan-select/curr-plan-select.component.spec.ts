import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrPlanSelectComponent} from './curr-plan-select.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CurrPlanSelectComponent', () => {
  let component: CurrPlanSelectComponent;
  let fixture: ComponentFixture<CurrPlanSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrPlanSelectComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrPlanSelectComponent);
    component = fixture.componentInstance;
    component.currOptions = [];
    component.planOptions = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
