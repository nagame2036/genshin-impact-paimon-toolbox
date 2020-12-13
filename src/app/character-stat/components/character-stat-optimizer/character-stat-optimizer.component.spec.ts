import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterStatOptimizerComponent} from './character-stat-optimizer.component';
import {CharacterStatModule} from '../../character-stat.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CharacterStatOptimizerComponent', () => {
  let component: CharacterStatOptimizerComponent;
  let fixture: ComponentFixture<CharacterStatOptimizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterStatOptimizerComponent
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
    fixture = TestBed.createComponent(CharacterStatOptimizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
