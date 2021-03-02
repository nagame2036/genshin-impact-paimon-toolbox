import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponDetailComponent} from './weapon-detail.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponDetailComponent', () => {
  let component: WeaponDetailComponent;
  let fixture: ComponentFixture<WeaponDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaponDetailComponent],
      imports: [WeaponModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
