import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponListHeaderComponent} from './weapon-list-header.component';
import {WeaponModule} from '../../weapon.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('WeaponListHeaderComponent', () => {
  let component: WeaponListHeaderComponent;
  let fixture: ComponentFixture<WeaponListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeaponListHeaderComponent
      ],
      imports: [
        WeaponModule,
        AppTestingModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
