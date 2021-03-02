import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CraftDialogComponent} from './craft-dialog.component';
import {MaterialModule} from '../../material.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('CraftDialogComponent', () => {
  let component: CraftDialogComponent;
  let fixture: ComponentFixture<CraftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CraftDialogComponent],
      imports: [MaterialModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
