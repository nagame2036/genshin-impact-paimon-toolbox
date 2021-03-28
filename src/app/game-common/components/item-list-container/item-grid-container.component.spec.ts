import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemGridContainerComponent} from './item-grid-container.component';
import {GameCommonModule} from '../../game-common.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('ItemGridContainerComponent', () => {
  let component: ItemGridContainerComponent;
  let fixture: ComponentFixture<ItemGridContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemGridContainerComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGridContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
