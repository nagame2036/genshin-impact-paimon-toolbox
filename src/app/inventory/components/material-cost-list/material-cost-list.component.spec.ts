import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialCostListComponent} from './material-cost-list.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {ItemList} from '../../../material/models/item-list.model';

describe('MaterialsCostListComponent', () => {
  let component: MaterialCostListComponent;
  let fixture: ComponentFixture<MaterialCostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialCostListComponent
      ],
      imports: [
        InventoryModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCostListComponent);
    component = fixture.componentInstance;
    component.costs = [
      {text: '', value: new ItemList()}
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
