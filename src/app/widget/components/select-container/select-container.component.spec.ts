import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectContainerComponent} from './select-container.component';
import {WidgetModule} from '../../widget.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('SelectContainerComponent', () => {
  let component: SelectContainerComponent;
  let fixture: ComponentFixture<SelectContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectContainerComponent],
      imports: [WidgetModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
