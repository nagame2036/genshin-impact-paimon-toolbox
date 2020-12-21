import {NgModule} from '@angular/core';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';

const config: DBConfig = {
  name: 'PaimonToolbox',
  version: 1,
  objectStoresMeta: [
    {
      store: 'party-characters',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: []
    },
    {
      store: 'party-weapons',
      storeConfig: {keyPath: 'key', autoIncrement: true},
      storeSchema: [
        {name: 'id', keypath: 'id', options: {unique: false}}
      ]
    },
    {
      store: 'materials',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: []
    },
    {
      store: 'character-plans',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: []
    },
    {
      store: 'weapon-plans',
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
