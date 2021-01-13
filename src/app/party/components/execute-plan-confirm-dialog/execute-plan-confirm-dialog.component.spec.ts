import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutePlanConfirmDialogComponent} from './execute-plan-confirm-dialog.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('ExecutePlanConfirmDialogComponent', () => {
  let component: ExecutePlanConfirmDialogComponent;
  let fixture: ComponentFixture<ExecutePlanConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExecutePlanConfirmDialogComponent
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
    fixture = TestBed.createComponent(ExecutePlanConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
