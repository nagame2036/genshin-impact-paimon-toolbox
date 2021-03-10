import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./setting/setting.module').then(m => m.SettingModule),
  },
  {
    path: 'characters',
    loadChildren: () =>
      import('./character/character.module').then(m => m.CharacterModule),
  },
  {
    path: 'weapons',
    loadChildren: () =>
      import('./weapon/weapon.module').then(m => m.WeaponModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'resin',
    loadChildren: () => import('./resin/resin.module').then(m => m.ResinModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
