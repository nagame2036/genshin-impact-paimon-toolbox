import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RingButtonComponent} from './ring-button.component';

describe('RingButtonComponent', () => {
  let component: RingButtonComponent;
  let fixture: ComponentFixture<RingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RingButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
