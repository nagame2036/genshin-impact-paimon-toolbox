import {TestBed} from '@angular/core/testing';

import {InventoryService} from './inventory.service';
import {AppIndexedDbModule} from '../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../app-translate.module';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    });
    service = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
