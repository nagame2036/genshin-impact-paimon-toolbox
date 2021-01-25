import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutePlanConfirmDialogComponent} from './execute-plan-confirm-dialog.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {ItemList} from '../../../inventory/models/item-list.model';

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
        AppTranslateModule,
        AppIndexedDbModule,
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
      cost: new ItemList(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});