import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatetimePickerComponent} from './datetime-picker.component';
import {WidgetModule} from '../../../widget/widget.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('DatetimePickerComponent', () => {
  let component: DatetimePickerComponent;
  let fixture: ComponentFixture<DatetimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatetimePickerComponent],
      imports: [WidgetModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
