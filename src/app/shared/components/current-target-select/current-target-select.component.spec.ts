import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentTargetSelectComponent} from './current-target-select.component';
import {AppTranslateModule} from '../../../app-translate.module';

describe('CurrentTargetSelectComponent', () => {
  let component: CurrentTargetSelectComponent;
  let fixture: ComponentFixture<CurrentTargetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrentTargetSelectComponent
      ],
      imports: [
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTargetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
