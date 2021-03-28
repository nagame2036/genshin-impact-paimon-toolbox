import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponViewOptionsComponent} from './weapon-view-options.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponViewOptionsComponent', () => {
  let component: WeaponViewOptionsComponent;
  let fixture: ComponentFixture<WeaponViewOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponViewOptionsComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponViewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
