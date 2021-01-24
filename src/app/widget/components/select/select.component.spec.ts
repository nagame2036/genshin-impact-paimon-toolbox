import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectComponent} from './select.component';
import {WidgetModule} from '../../widget.module';
import {AppTranslateModule} from '../../../app-translate.module';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SelectComponent
      ],
      imports: [
        WidgetModule,
        AppTranslateModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
