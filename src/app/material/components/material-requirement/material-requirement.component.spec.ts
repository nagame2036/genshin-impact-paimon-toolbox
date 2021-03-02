import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialRequirementComponent} from './material-requirement.component';
import {MaterialModule} from '../../material.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('MaterialRequirementComponent', () => {
  let component: MaterialRequirementComponent;
  let fixture: ComponentFixture<MaterialRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialRequirementComponent],
      imports: [MaterialModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequirementComponent);
    component = fixture.componentInstance;
    component.requirements = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
