import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListComponent} from './weapon-list.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {WeaponModule} from '../../weapon.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('WeaponListComponent', () => {
  let component: WeaponListComponent;
  let fixture: ComponentFixture<WeaponListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponListComponent
      ],
      imports: [
        WeaponModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
