import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';

import {Toast} from '@ionic-native/toast';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import {Dialogs} from '@ionic-native/dialogs';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';

import {GenericProvider} from '../../providers/generic/generic';
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
        private nativePageTransitions : NativePageTransitions,
        private actionCtrl : ActionSheetController,
        private dialogs : Dialogs,
        private spinnerDialog : SpinnerDialog
    ) {
    
    }

    ionViewDidEnter(){
        this.datas = [];
        this.revenue = [];
        this.expenses = [];
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
        let options : NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativePageTransitions.fade(options);
        if(this.transaction == 'revenue'){
            this.navCtrl.push('transaction-form',{category_type : 'Revenue'});
        }
        if(this.transaction == 'expenses'){
            this.navCtrl.push('transaction-form',{category_type : 'Expenses'});
        }
    }

    view(item){
        this.navCtrl.push('transaction-detail',{id:item.id});
    }

    edit(item){
        this.navCtrl.push('transaction-form',{id:item.id,category_type : item.category_type});
    }

    delete(item,index){
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
        this.actionCtrl.create({
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
                    role : 'cancel',
                    handler : () => {
                        this.delete(item,index);
                    }
                }
            ]
        });
    }

}
