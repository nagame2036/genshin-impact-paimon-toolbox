import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWeaponComponent} from './add-weapon.component';
import {WeaponModule} from '../../weapon.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AddWeaponComponent', () => {
  let component: AddWeaponComponent;
  let fixture: ComponentFixture<AddWeaponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddWeaponComponent
      ],
      imports: [
        WeaponModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWeaponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
