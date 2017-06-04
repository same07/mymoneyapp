import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {Toast} from '@ionic-native/toast';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';

import {GenericProvider} from '../../providers/generic/generic';

/**
 * Generated class for the TransactionDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'transaction-detail'
})
@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html',
})
export class TransactionDetailPage {

    data : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private generic : GenericProvider,
        private toast : Toast,
        private spinnerDialog : SpinnerDialog
    ) {
        
        this.data = {
            id : this.navParams.get('id'),
            category : {}
        };

        this.loadData();
    }

    ionViewWillEnter(){
        if(this.navParams.get('id') == undefined){
            this.navCtrl.popToRoot();
        }
    }

    loadData(){
        this.spinnerDialog.show('','Please Wait',false);
        this.generic.viewTransaction(this.data).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                    return false;
                }
                this.data = result.data;
            },
            () => {
                this.spinnerDialog.hide();
            }
        );
    }

    edit(){
        this.navCtrl.push('transaction-form',{id:this.data.id});
    }

}
