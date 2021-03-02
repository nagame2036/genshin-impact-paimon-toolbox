import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinReplenishCalculatorComponent} from './resin-replenish-calculator.component';
import {AppTestingModule} from '../../../app-testing.module';
import {ResinModule} from '../../resin.module';

describe('ResinReplenishCalculatorComponent', () => {
  let component: ResinReplenishCalculatorComponent;
  let fixture: ComponentFixture<ResinReplenishCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResinReplenishCalculatorComponent],
      imports: [ResinModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResinReplenishCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
