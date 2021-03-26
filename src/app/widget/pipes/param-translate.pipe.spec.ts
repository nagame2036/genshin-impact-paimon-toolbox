import {ParamTranslatePipe} from './param-translate.pipe';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppTestingModule} from '../../app-testing.module';
import {WidgetModule} from '../widget.module';

describe('ParamTranslatePipe', () => {
  let pipe: ParamTranslatePipe;
  let fixture: ComponentFixture<ParamTranslatePipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParamTranslatePipe],
      imports: [WidgetModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamTranslatePipe);
    pipe = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
