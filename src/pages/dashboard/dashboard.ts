import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';

import {Toast} from '@ionic-native/toast';
import {Dialogs} from '@ionic-native/dialogs';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';

import {GenericProvider} from '../../providers/generic/generic';
import {AudioProvider} from '../../providers/audio/audio';
/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'dashboard'
})
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
    datas : any;
    transaction : string = 'revenue';
    revenue : any;
    expenses : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private generic : GenericProvider,
        private toast : Toast,
        private actionCtrl : ActionSheetController,
        private dialogs : Dialogs,
        private spinnerDialog : SpinnerDialog,
        private audioProvider : AudioProvider
    ) {
        this.datas = [];
        this.revenue = [];
        this.expenses = [];
    }

    ionViewDidEnter(){
        
        this.loadRevenue();
        this.loadExpenses();
        
    }

    loadRevenue(){
        this.spinnerDialog.show('','Please Wait',false);
        this.generic.loadRevenue({}).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                    return false;
                }
                this.revenue = result.data;
            },
            () =>{
                this.spinnerDialog.hide();
            }
        );
    }

    loadExpenses(){

        this.generic.loadExpenses({}).then((dt) => {
            let result : any = dt;
            if(result.error){
                this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                return false;
            }
            this.expenses = result.data;
        },() => {});
    }

    addTransaction(){
        this.playSound();
        if(this.transaction == 'revenue'){
            this.navCtrl.push('transaction-form',{category_type : 'Revenue'});
        }
        if(this.transaction == 'expenses'){
            this.navCtrl.push('transaction-form',{category_type : 'Expenses'});
        }
    }

    view(item){
        this.playSound();
        this.navCtrl.push('transaction-detail',{id:item.id});
    }

    edit(item){
        this.playSound();
        this.navCtrl.push('transaction-form',{id:item.id,category_type : item.category_type});
    }

    delete(item,index){
        this.playSound();
        this.dialogs.confirm('Are You sure want to delete this?','Delete Confirm',['Delete It!','Cancel']).then(
            (i) => {
                if(i == 1){
                    this.generic.deleteTransaction({id:item.id}).then(
                        (dt) => {
                            let result : any = dt;
                            if(result.error){
                                this.toast.show(result.msg,'2000','top').subscribe(
                                    () => {}
                                );
                                return false;
                            }
                            this.datas.splice(index,1);
                        },
                        () => {
                            this.toast.show('Failed to connect with server','3000','top').subscribe(()=>{});
                        }
                        
                    );
                }
            }
        );
    }

    showOptions(item,index){
        this.playSound();
        let action = this.actionCtrl.create({
            'title' : 'Action',
            'buttons' : [
                {
                    text : 'View',
                    handler : ()=>{
                        this.view(item);
                    }
                },
                {
                    text : 'Edit',
                    handler: () =>{
                        this.edit(item);
                    }
                },
                {
                    text : 'Delete',
                    handler: () =>{
                        this.delete(item,index);
                    }
                },
                {
                    text : 'Cancel',
                    role : 'cancel',
                    handler : () => {
                        
                    }
                }
            ]
        });
        action.present();
    }

    playSound(){
        this.audioProvider.play();
    }
}
