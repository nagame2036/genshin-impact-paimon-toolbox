import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterInfoGridComponent} from './character-info-grid.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterInfoGridComponent', () => {
  let component: CharacterInfoGridComponent;
  let fixture: ComponentFixture<CharacterInfoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterInfoGridComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterInfoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
