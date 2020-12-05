import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatOptimizerComponent} from './character-stat-optimizer.component';

describe('CharacterStatOptimizerComponent', () => {
  let component: CharacterStatOptimizerComponent;
  let fixture: ComponentFixture<CharacterStatOptimizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatOptimizerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatOptimizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
