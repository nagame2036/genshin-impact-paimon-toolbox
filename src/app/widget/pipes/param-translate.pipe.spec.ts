import {ParamTranslatePipe} from './param-translate.pipe';
import {inject, TestBed} from '@angular/core/testing';
import {AppTestingModule} from '../../app-testing.module';
import {WidgetModule} from '../widget.module';
import {TranslateService} from '@ngx-translate/core';

describe('ParamTranslatePipe', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParamTranslatePipe],
      imports: [WidgetModule, AppTestingModule],
    });
  });

  it('create an instance', inject(
    [TranslateService],
    (translator: TranslateService) => {
      const pipe = new ParamTranslatePipe(translator);
      expect(pipe).toBeTruthy();
    },
  ));
});
