import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResinCalculatorComponent} from './pages/resin-calculator/resin-calculator.component';

const routes: Routes = [{path: '', component: ResinCalculatorComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResinRoutingModule {}
