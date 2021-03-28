import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponInfoGridComponent} from './weapon-info-grid.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponInfoGridComponent', () => {
  let component: WeaponInfoGridComponent;
  let fixture: ComponentFixture<WeaponInfoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponInfoGridComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponInfoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
