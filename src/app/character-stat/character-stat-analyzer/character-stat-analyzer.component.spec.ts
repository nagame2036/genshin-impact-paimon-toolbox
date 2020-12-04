import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatAnalyzerComponent} from './character-stat-analyzer.component';

describe('CharacterStatAdviserComponent', () => {
  let component: CharacterStatAnalyzerComponent;
  let fixture: ComponentFixture<CharacterStatAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatAnalyzerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
