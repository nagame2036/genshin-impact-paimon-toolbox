import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutePlanConfirmDialogComponent} from './execute-plan-confirm-dialog.component';
import {GameCommonModule} from '../../../game-common/game-common.module';
import {AppTestingModule} from '../../../app-testing.module';
import {WidgetModule} from '../../../widget/widget.module';

describe('ExecutePlanConfirmDialogComponent', () => {
  let component: ExecutePlanConfirmDialogComponent;
  let fixture: ComponentFixture<ExecutePlanConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutePlanConfirmDialogComponent],
      imports: [GameCommonModule, AppTestingModule, WidgetModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutePlanConfirmDialogComponent);
    component = fixture.componentInstance;
    component.data = {
      plan: '',
      item: '',
      requirement: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
