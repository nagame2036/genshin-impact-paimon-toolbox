import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialListComponent} from './material-list.component';
import {InventoryModule} from '../../../inventory/inventory.module';
import {AppTestingModule} from '../../../app-testing.module';

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialListComponent,
      ],
      imports: [
        InventoryModule,
        AppTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
