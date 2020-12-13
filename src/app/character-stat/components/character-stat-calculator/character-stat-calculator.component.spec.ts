import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatCalculatorComponent} from './character-stat-calculator.component';
import {CharacterStatModule} from '../../character-stat.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterStatCalculatorComponent', () => {
  let component: CharacterStatCalculatorComponent;
  let fixture: ComponentFixture<CharacterStatCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterStatCalculatorComponent
      ],
      imports: [
        CharacterStatModule,
        BrowserAnimationsModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStatCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
