import {TestBed} from '@angular/core/testing';

import {DatetimeService} from './datetime.service';
import {AppTestingModule} from '../../app-testing.module';

describe('DatetimeService', () => {
  let service: DatetimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
    });
    service = TestBed.inject(DatetimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get calender', () => {
    const month202002 = service.getCalendar(new Date(2020, 1));
    expect(month202002[0].length).toBe(5);
    expect(month202002[1].length).toBe(29);
    const month202104 = service.getCalendar(new Date(2021, 3));
    expect(month202104[0].length).toBe(3);
    expect(month202104[1].length).toBe(30);
  });

  it('get calender of locale en', () => {
    const month202002 = service.getCalendar(new Date(2020, 1), 'en');
    expect(month202002[0].length).toBe(6);
    expect(month202002[1].length).toBe(29);
    const month202104 = service.getCalendar(new Date(2021, 3), 'en');
    expect(month202104[0].length).toBe(4);
    expect(month202104[1].length).toBe(30);
  });
});
