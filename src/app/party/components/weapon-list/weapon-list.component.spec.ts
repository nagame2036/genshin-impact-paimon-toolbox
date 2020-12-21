import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListComponent} from './weapon-list.component';
import {AppTranslateModule} from '../../../app-translate.module';
import {PartyModule} from '../../party.module';

describe('WeaponListComponent', () => {
  let component: WeaponListComponent;
  let fixture: ComponentFixture<WeaponListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponListComponent
      ],
      imports: [
        PartyModule,
        AppTranslateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
