import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinReplenishCalculatorComponent} from './resin-replenish-calculator.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {ResinModule} from '../../resin.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ResinReplenishCalculatorComponent', () => {
  let component: ResinReplenishCalculatorComponent;
  let fixture: ComponentFixture<ResinReplenishCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResinReplenishCalculatorComponent
      ],
      imports: [
        ResinModule,
        AppTranslateModule,
        BrowserAnimationsModule
      ]
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
