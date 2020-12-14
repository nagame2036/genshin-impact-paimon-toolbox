import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListDialogComponent} from './weapon-list-dialog.component';
import {PartyModule} from '../../party.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('WeaponListDialogComponent', () => {
  let component: WeaponListDialogComponent;
  let fixture: ComponentFixture<WeaponListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponListDialogComponent
      ],
      imports: [
        PartyModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(WeaponListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
