import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterDetailDialogComponent} from './character-detail-dialog.component';
import {PartyModule} from '../../party.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterDetailDialogComponent', () => {
  let component: CharacterDetailDialogComponent;
  let fixture: ComponentFixture<CharacterDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterDetailDialogComponent
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
            character: {
              ascension: 0,
              talents: []
            },
            plan: {
              levelup: {
                phase: 0,
                level: 1
              },
              talents: []
            }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
