import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinPageComponent} from './resin-page.component';

describe('ResinPageComponent', () => {
  let component: ResinPageComponent;
  let fixture: ComponentFixture<ResinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResinPageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
