import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemImageContainerComponent} from './item-image-container.component';

describe('ItemImageContainerComponent', () => {
  let component: ItemImageContainerComponent;
  let fixture: ComponentFixture<ItemImageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemImageContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
