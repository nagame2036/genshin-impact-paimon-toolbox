import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveConfirmDialogComponent} from './remove-confirm-dialog.component';
import {PartyModule} from '../../party.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppTranslateModule} from '../../../app-translate.module';

describe('RemoveConfirmDialogComponent', () => {
  let component: RemoveConfirmDialogComponent;
  let fixture: ComponentFixture<RemoveConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RemoveConfirmDialogComponent
      ],
      imports: [
        PartyModule,
        AppTranslateModule
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
    fixture = TestBed.createComponent(RemoveConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
