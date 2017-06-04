import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionFormPage } from './transaction-form';

@NgModule({
  declarations: [
    TransactionFormPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionFormPage),
  ],
  exports: [
    TransactionFormPage
  ]
})
export class TransactionFormPageModule {}
