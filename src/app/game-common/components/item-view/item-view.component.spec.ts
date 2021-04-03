import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemViewComponent} from './item-view.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemViewComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewComponent);
    component = fixture.componentInstance;
    component.item = {id: 1, rarity: 1};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
