import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VictimListPage } from './victim-list.page';

const routes: Routes = [
  {
    path: '',
    component: VictimListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VictimListPageRoutingModule {}
