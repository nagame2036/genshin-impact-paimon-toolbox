import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatFormComponent} from './character-stat-form.component';

describe('StatisticAnalyzerComponent', () => {
  let component: CharacterStatFormComponent;
  let fixture: ComponentFixture<CharacterStatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
