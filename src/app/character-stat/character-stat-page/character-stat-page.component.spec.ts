import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatPageComponent} from './character-stat-page.component';

describe('StatisticPageComponent', () => {
  let component: CharacterStatPageComponent;
  let fixture: ComponentFixture<CharacterStatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatPageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
