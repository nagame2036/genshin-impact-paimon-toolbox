import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResinPageComponent} from './resin-page.component';
import {ResinModule} from '../../resin.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ResinPageComponent', () => {
  let component: ResinPageComponent;
  let fixture: ComponentFixture<ResinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResinPageComponent
      ],
      imports: [
        ResinModule,
        AppTranslateModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
