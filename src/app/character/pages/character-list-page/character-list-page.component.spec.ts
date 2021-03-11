import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterListPageComponent} from './character-list-page.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterListPageComponent', () => {
  let component: CharacterListPageComponent;
  let fixture: ComponentFixture<CharacterListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterListPageComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
