import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemSummaryNotSelectComponent} from './item-summary-not-select.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ItemSummaryNotSelectComponent', () => {
  let component: ItemSummaryNotSelectComponent;
  let fixture: ComponentFixture<ItemSummaryNotSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSummaryNotSelectComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSummaryNotSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
