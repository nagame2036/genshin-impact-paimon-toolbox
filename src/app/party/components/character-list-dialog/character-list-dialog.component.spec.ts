import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterListDialogComponent} from './character-list-dialog.component';
import {PartyModule} from '../../party.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';

describe('CharacterListDialogComponent', () => {
  let component: CharacterListDialogComponent;
  let fixture: ComponentFixture<CharacterListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterListDialogComponent
      ],
      imports: [
        PartyModule,
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
    fixture = TestBed.createComponent(CharacterListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
