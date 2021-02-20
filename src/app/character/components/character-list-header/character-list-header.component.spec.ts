import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterListHeaderComponent} from './character-list-header.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterListHeaderComponent', () => {
  let component: CharacterListHeaderComponent;
  let fixture: ComponentFixture<CharacterListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterListHeaderComponent
      ],
      imports: [
        CharacterModule,
        AppTestingModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
