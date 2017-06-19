import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController} from 'ionic-angular';

import {SpinnerDialog} from '@ionic-native/spinner-dialog';
import {Toast} from '@ionic-native/toast';

import {GenericProvider} from '../../providers/generic/generic';
import {AudioProvider} from '../../providers/audio/audio';

/**
 * Generated class for the CategoryListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'category-list'
})
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
})
export class CategoryListPage {

    datas :any;
    data : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private generic : GenericProvider,
        private spinnerDialog : SpinnerDialog,
        private toast : Toast,
        private viewCtrl : ViewController,
        private modalCtrl : ModalController,
        private audioProvide : AudioProvider
    ) {
        this.data = {
            offset : 1,
            keyword : '',
            category_type : this.navParams.get('category_type')
        };
        this.datas = [];
        this.loadData();
    }

    loadData(){
        this.spinnerDialog.show();
        this.generic.loadCategory(this.data).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(() =>{});
                    return false;
                }
                this.datas = result.data;
            },
            (err) => {
                let result : any =err;
                this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                this.spinnerDialog.hide();
            }
        );
    }

    moreData(ev){
        this.data.offset++;
        this.generic.loadCategory(this.data).then(
            (dt) => {
                ev.complete();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                    return false;
                }
                if(result.data.length > 0){
                    for(let i = 0;i<result.data.length;i++){
                        this.datas.push(result.data[i]);
                    }
                }
            },
            (err) =>{
                ev.complete();
                let result : any =err;
                this.data.offset--;
                this.toast.show(result.msg,'2000','top').subscribe(()=>{});
            }
        );
    }

    onSearch(ev){
        this.data.offset = 1;
        return this.loadData();
    }

    selectCategory(item){
        this.playSound();
        this.viewCtrl.dismiss({success:true,name:item.name,id:item.id});
    }

    close(){
        this.playSound();
        this.viewCtrl.dismiss();
    }

    add(){
        this.playSound();
        let modal = this.modalCtrl.create('category-form',{category_type : this.data.category_type});
        modal.present();
        modal.onDidDismiss(
            () => {
                this.data.offset = 1;
                this.loadData();
            }
        );
    }

    playSound(){
        this.audioProvide.play();
    }

}
