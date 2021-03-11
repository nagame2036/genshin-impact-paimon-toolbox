import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListPageComponent} from './weapon-list-page.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponListPageComponent', () => {
  let component: WeaponListPageComponent;
  let fixture: ComponentFixture<WeaponListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponListPageComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
