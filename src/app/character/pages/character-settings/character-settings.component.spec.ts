import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterSettingsComponent} from './character-settings.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterSettingsComponent', () => {
  let component: CharacterSettingsComponent;
  let fixture: ComponentFixture<CharacterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterSettingsComponent],
      imports: [CharacterModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
