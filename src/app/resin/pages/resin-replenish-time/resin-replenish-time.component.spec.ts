import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinReplenishTimeComponent} from './resin-replenish-time.component';
import {AppTestingModule} from '../../../app-testing.module';
import {ResinModule} from '../../resin.module';

describe('ResinReplenishTimeComponent', () => {
  let component: ResinReplenishTimeComponent;
  let fixture: ComponentFixture<ResinReplenishTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResinReplenishTimeComponent],
      imports: [ResinModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResinReplenishTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
