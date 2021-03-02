import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiSelectAndSelectAllComponent} from './multi-select-and-select-all.component';
import {AppTestingModule} from '../../../app-testing.module';
import {GameCommonModule} from '../../game-common.module';

describe('MultiSelectAndSelectAllComponent', () => {
  let component: MultiSelectAndSelectAllComponent;
  let fixture: ComponentFixture<MultiSelectAndSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectAndSelectAllComponent],
      imports: [GameCommonModule, AppTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectAndSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
