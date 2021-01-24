import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutePlanConfirmDialogComponent} from './execute-plan-confirm-dialog.component';
import {PartyModule} from '../../party.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {ItemList} from '../../../material/models/item-list.model';

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
