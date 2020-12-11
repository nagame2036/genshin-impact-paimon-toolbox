import {NgModule} from '@angular/core';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';

const config: DBConfig = {
  name: 'GenshinImpactToolbox',
  version: 10,
  objectStoresMeta: [
    {
      store: 'materials',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: []
    }
  ]
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(config)],
  exports: [NgxIndexedDBModule]
})
export class AppIndexedDbModule {
}
