import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListOptionsComponent} from './weapon-list-options.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponListOptionsComponent', () => {
  let component: WeaponListOptionsComponent;
  let fixture: ComponentFixture<WeaponListOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponListOptionsComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponListOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
