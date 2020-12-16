import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCharacterDialogComponent} from './add-character-dialog.component';
import {PartyModule} from '../../party.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AddCharacterDialogComponent', () => {
  let component: AddCharacterDialogComponent;
  let fixture: ComponentFixture<AddCharacterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddCharacterDialogComponent
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
    fixture = TestBed.createComponent(AddCharacterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
