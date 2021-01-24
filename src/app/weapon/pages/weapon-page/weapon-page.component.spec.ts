import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPageComponent} from './weapon-page.component';
import {WeaponModule} from '../../weapon.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

describe('WeaponPageComponent', () => {
  let component: WeaponPageComponent;
  let fixture: ComponentFixture<WeaponPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponPageComponent
      ],
      imports: [
        WeaponModule,
        BrowserAnimationsModule,
        AppIndexedDbModule,
        AppTranslateModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
