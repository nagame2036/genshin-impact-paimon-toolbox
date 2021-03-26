import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemOverviewStatsDataComponent} from './item-overview-stats-data.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ItemOverviewStatsDataComponent', () => {
  let component: ItemOverviewStatsDataComponent;
  let fixture: ComponentFixture<ItemOverviewStatsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemOverviewStatsDataComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOverviewStatsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
