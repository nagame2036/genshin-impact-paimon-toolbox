import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponDetailDialogComponent} from './weapon-detail-dialog.component';
import {PartyModule} from '../../party.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('WeaponDetailDialogComponent', () => {
  let component: WeaponDetailDialogComponent;
  let fixture: ComponentFixture<WeaponDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponDetailDialogComponent
      ],
      imports: [
        PartyModule,
        BrowserAnimationsModule,
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
          useValue: {
            weapon: {
              ascension: 0
            },
            plan: {
              levelup: {
                phase: 0,
                level: 1
              }
            }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
