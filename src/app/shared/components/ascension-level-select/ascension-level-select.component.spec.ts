import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AscensionLevelSelectComponent} from './ascension-level-select.component';
import {SharedModule} from '../../shared.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AscensionLevelSelectComponent', () => {
  let component: AscensionLevelSelectComponent;
  let fixture: ComponentFixture<AscensionLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AscensionLevelSelectComponent
      ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscensionLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
