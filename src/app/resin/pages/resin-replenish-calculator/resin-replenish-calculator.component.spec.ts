import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinReplenishCalculatorComponent} from './resin-replenish-calculator.component';

describe('ResinReplenishCalculatorComponent', () => {
  let component: ResinReplenishCalculatorComponent;
  let fixture: ComponentFixture<ResinReplenishCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResinReplenishCalculatorComponent]
    })
      .compileComponents();
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
