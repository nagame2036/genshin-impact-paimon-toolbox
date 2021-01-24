import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialRequirementComponent} from './material-requirement.component';
import {InventoryModule} from '../../inventory.module';
import {AppTranslateModule} from '../../../app-translate.module';
import {AppIndexedDbModule} from '../../../app-indexed-db.module';
import {ItemList} from '../../models/item-list.model';

describe('MaterialRequirementComponent', () => {
  let component: MaterialRequirementComponent;
  let fixture: ComponentFixture<MaterialRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MaterialRequirementComponent
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
    fixture = TestBed.createComponent(MaterialRequirementComponent);
    component = fixture.componentInstance;
    component.requirements = [
      {text: '', value: new ItemList()}
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
