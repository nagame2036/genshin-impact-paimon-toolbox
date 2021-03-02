import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemOverviewDataComponent} from './item-overview-data.component';

describe('ItemOverviewDataComponent', () => {
  let component: ItemOverviewDataComponent;
  let fixture: ComponentFixture<ItemOverviewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemOverviewDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOverviewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
