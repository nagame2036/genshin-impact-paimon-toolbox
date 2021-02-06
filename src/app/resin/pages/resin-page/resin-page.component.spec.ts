import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinPageComponent} from './resin-page.component';
import {ResinModule} from '../../resin.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ResinPageComponent', () => {
  let component: ResinPageComponent;
  let fixture: ComponentFixture<ResinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResinPageComponent
      ],
      imports: [
        ResinModule,
        AppTestingModule,
      ]
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
