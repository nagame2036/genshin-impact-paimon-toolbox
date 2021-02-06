import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWeaponComponent} from './add-weapon.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('AddWeaponComponent', () => {
  let component: AddWeaponComponent;
  let fixture: ComponentFixture<AddWeaponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddWeaponComponent
      ],
      imports: [
        WeaponModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWeaponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
