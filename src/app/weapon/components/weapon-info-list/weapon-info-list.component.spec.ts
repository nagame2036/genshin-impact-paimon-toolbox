import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponInfoListComponent} from './weapon-info-list.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponInfoListComponent', () => {
  let component: WeaponInfoListComponent;
  let fixture: ComponentFixture<WeaponInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponInfoListComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
