import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinCalculatorComponent} from './resin-calculator.component';
import {AppTestingModule} from '../../../app-testing.module';
import {ResinModule} from '../../resin.module';

describe('ResinCalculatorComponent', () => {
  let component: ResinCalculatorComponent;
  let fixture: ComponentFixture<ResinCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResinCalculatorComponent],
      imports: [ResinModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResinCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
