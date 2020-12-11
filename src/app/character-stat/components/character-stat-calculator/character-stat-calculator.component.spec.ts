import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatCalculatorComponent} from './character-stat-calculator.component';

describe('CharacterStatCalculatorComponent', () => {
  let component: CharacterStatCalculatorComponent;
  let fixture: ComponentFixture<CharacterStatCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatCalculatorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
