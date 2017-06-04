import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RevenueListPage } from './revenue-list';

@NgModule({
  declarations: [
    RevenueListPage,
  ],
  imports: [
    IonicPageModule.forChild(RevenueListPage),
  ],
  exports: [
    RevenueListPage
  ]
})
export class RevenueListPageModule {}
