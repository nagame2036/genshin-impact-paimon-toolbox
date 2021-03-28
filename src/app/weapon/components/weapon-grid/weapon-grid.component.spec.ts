import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponGridComponent} from './weapon-grid.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponGridComponent', () => {
  let component: WeaponGridComponent;
  let fixture: ComponentFixture<WeaponGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponGridComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
