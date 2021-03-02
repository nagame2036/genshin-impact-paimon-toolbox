import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterPlanComponent} from './character-plan.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterPlanComponent', () => {
  let component: CharacterPlanComponent;
  let fixture: ComponentFixture<CharacterPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterPlanComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
