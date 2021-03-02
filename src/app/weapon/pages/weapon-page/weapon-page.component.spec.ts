import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPageComponent} from './weapon-page.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponPageComponent', () => {
  let component: WeaponPageComponent;
  let fixture: ComponentFixture<WeaponPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponPageComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
