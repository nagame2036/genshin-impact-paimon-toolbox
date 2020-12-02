import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatProfileComponent} from './character-stat-profile.component';

describe('StatisticAnalyzerComponent', () => {
  let component: CharacterStatProfileComponent;
  let fixture: ComponentFixture<CharacterStatProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatProfileComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
