import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterGridComponent} from './character-grid.component';
import {AppTestingModule} from '../../../app-testing.module';
import {CharacterModule} from '../../character.module';

describe('CharacterGridComponent', () => {
  let component: CharacterGridComponent;
  let fixture: ComponentFixture<CharacterGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterGridComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
