import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';

import {SpinnerDialog} from '@ionic-native/spinner-dialog';
import {Toast} from '@ionic-native/toast';
import {Dialogs} from '@ionic-native/dialogs';


import {GenericProvider} from '../../providers/generic/generic';

/**
 * Generated class for the RevenueListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'revenue'
})
@Component({
  selector: 'page-revenue-list',
  templateUrl: 'revenue-list.html',
})
export class RevenueListPage {
    datas : any;
    data : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private spinnerDialog : SpinnerDialog,
        private toast : Toast,
        private generic: GenericProvider,
        private dialogs : Dialogs,
        private actionCtrl : ActionSheetController
    ) {
        //this.datas = [];
    }

    ionViewDidEnter(){
        this.data = {
            offset : 1,
            keyword : ''
        };
        this.datas = [];
        this.loadData();
    }

    loadData(){
        this.spinnerDialog.show('','Please Wait',false);
        this.generic.loadRevenue(this.data).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(
                        () => {}
                    );
                    return false;
                }
                this.datas = result.data;
            },
            () => {
                this.spinnerDialog.hide();
                this.toast.show('Failed to connect with server','3000','top').subscribe(
                    () => {}
                );
            }
        );
    }

    loadMore(ev){
        this.data.offset++;
        this.generic.loadRevenue(this.data).then(
            (dt) => {
                ev.complete()
                let result : any = dt;
                if(result.error){
                    this.data.offset--;
                    this.toast.show(result.msg,'2000','top').subscribe(
                        () => {}
                    );
                    return false;
                }
                if(result.data.length > 0){
                    for(let i = 0;i<result.data.length;i++){
                        this.datas.push(result.data);
                    }
                }
            },
            () => {
                ev.complete();
                this.toast.show('Failed to connect with server','3000','top').subscribe(
                    () => {}
                );
            }
        );
    }

    onSearch(){
        this.data.offset = 1;
        return this.loadData();
    }

    view(item){
        this.navCtrl.push('transaction-detail',{id:item.id});
    }

    edit(item){
        this.navCtrl.push('transaction-form',{id:item.id,category_type : 'Revenue'});
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

    addRevenue(){
        this.navCtrl.push('transaction-form',{category_type : 'Revenue'});
    }

}
