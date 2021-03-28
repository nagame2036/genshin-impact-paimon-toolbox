import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterViewOptionsComponent} from './character-view-options.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterViewOptionsComponent', () => {
  let component: CharacterViewOptionsComponent;
  let fixture: ComponentFixture<CharacterViewOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterViewOptionsComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterViewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
