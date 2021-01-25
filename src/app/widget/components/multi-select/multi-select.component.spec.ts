import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiSelectComponent} from './multi-select.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {WidgetModule} from '../../widget.module';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MultiSelectComponent
      ],
      imports: [
        WidgetModule,
        AppTranslateModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    component.options = [];
    component.values = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});