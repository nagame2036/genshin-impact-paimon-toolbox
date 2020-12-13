import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AmountInputComponent} from './amount-input.component';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AmountInputComponent
      ],
      imports: [
        HttpClientModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
