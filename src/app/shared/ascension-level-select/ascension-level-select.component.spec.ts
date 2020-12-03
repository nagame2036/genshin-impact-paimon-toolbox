import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AscensionLevelSelectComponent} from './ascension-level-select.component';

describe('AscensionLevelSelectComponent', () => {
  let component: AscensionLevelSelectComponent;
  let fixture: ComponentFixture<AscensionLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscensionLevelSelectComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscensionLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
