import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CharacterInfoListComponent} from './character-info-list.component';
import {CharacterModule} from '../../character.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CharacterInfoListComponent', () => {
  let component: CharacterInfoListComponent;
  let fixture: ComponentFixture<CharacterInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CharacterInfoListComponent
      ],
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
