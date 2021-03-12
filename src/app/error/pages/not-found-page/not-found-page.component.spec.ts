import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotFoundPageComponent} from './not-found-page.component';
import {ErrorModule} from '../../error.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundPageComponent],
      imports: [ErrorModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
