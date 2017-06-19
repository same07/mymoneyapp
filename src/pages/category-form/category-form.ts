import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController} from 'ionic-angular';

import {Dialogs} from '@ionic-native/dialogs';
import {Toast} from '@ionic-native/toast';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';

import {GenericProvider} from '../../providers/generic/generic';
import {AudioProvider} from '../../providers/audio/audio';

/**
 * Generated class for the CategoryFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'category-form'
})
@Component({
  selector: 'page-category-form',
  templateUrl: 'category-form.html',
})
export class CategoryFormPage {

    data : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private dialogs : Dialogs,
        private generic : GenericProvider,
        private view : ViewController,
        private toast : Toast,
        private spinnerDialog : SpinnerDialog,
        private audioProvider : AudioProvider
    ) {
        this.data = {
            category_type : this.navParams.get('category_type'),
            keyword : ''
        };
    }

    save(){
        this.playSound();
        if(this.data.name == undefined || this.data.name == ''){
            this.dialogs.alert('Category Name is required !!');
            return false;
        }
        this.spinnerDialog.show('','Please Wait');
        this.generic.saveCategory(this.data).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                    return false;
                }
                this.view.dismiss();
            },
            () => {
                this.spinnerDialog.hide();
                this.view.dismiss();
            }
        );
    }

    playSound(){
        this.audioProvider.play();
    }

    close(){
        this.playSound();
        this.view.dismiss();
    }

}
