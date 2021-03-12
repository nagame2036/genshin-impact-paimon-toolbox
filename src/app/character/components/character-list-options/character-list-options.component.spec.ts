import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterListOptionsComponent} from './character-list-options.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterListOptionsComponent', () => {
  let component: CharacterListOptionsComponent;
  let fixture: ComponentFixture<CharacterListOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterListOptionsComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterListOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
