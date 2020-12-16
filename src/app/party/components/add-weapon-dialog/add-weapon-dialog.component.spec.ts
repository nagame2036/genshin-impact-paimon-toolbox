import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWeaponDialogComponent} from './add-weapon-dialog.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AddWeaponDialogComponent', () => {
  let component: AddWeaponDialogComponent;
  let fixture: ComponentFixture<AddWeaponDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddWeaponDialogComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
        AppTranslateModule,
        AppIndexedDbModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWeaponDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
