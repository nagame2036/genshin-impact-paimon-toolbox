import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectComponent} from './select.component';
import {SharedModule} from '../../shared.module';
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
        SharedModule,
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
