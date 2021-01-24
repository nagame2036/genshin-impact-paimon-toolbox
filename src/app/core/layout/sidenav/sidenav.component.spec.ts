import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SidenavComponent} from './sidenav.component';
import {CoreModule} from '../../core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppTranslateModule} from '../../../app-translate.module';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidenavComponent
      ],
      imports: [
        CoreModule,
        BrowserAnimationsModule,
        AppTranslateModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
