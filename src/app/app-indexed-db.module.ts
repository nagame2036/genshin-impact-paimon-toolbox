import {NgModule} from '@angular/core';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';

const config: DBConfig = {
  name: 'GenshinImpactToolbox',
  version: 1,
  objectStoresMeta: [
    {
      store: 'party-characters',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: []
    },
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
