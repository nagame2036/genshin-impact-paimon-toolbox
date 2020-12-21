import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrentTargetLevelSelectComponent} from './current-target-level-select.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CurrentTargetLevelSelectComponent', () => {
  let component: CurrentTargetLevelSelectComponent;
  let fixture: ComponentFixture<CurrentTargetLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CurrentTargetLevelSelectComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTargetLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
