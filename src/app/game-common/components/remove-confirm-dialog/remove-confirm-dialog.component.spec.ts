import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveConfirmDialogComponent} from './remove-confirm-dialog.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('RemoveConfirmDialogComponent', () => {
  let component: RemoveConfirmDialogComponent;
  let fixture: ComponentFixture<RemoveConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RemoveConfirmDialogComponent
      ],
      imports: [
        GameCommonModule,
        AppTestingModule,
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
