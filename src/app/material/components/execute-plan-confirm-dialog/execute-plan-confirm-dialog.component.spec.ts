import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutePlanConfirmDialogComponent} from './execute-plan-confirm-dialog.component';
import {GameCommonModule} from '../../../game-common/game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ExecutePlanConfirmDialogComponent', () => {
  let component: ExecutePlanConfirmDialogComponent;
  let fixture: ComponentFixture<ExecutePlanConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExecutePlanConfirmDialogComponent
      ],
      imports: [
        GameCommonModule,
        AppTestingModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutePlanConfirmDialogComponent);
    component = fixture.componentInstance;
    component.data = {
      title: '',
      item: '',
      requirement: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
