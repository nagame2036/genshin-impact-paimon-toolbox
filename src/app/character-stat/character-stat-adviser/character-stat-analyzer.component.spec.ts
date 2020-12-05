import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatAdviserComponent} from './character-stat-adviser.component';

describe('CharacterStatAdviserComponent', () => {
  let component: CharacterStatAdviserComponent;
  let fixture: ComponentFixture<CharacterStatAdviserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterStatAdviserComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatAdviserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
