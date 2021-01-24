import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveConfirmDialogComponent} from './remove-confirm-dialog.component';
import {PartyModule} from '../../party.module';
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
