import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

import {AuthProvider} from '../../providers/auth/auth';
import {Toast} from '@ionic-native/toast';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    data : any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private auth : AuthProvider,
        private events : Events,
        private toast : Toast,
        private spinner : SpinnerDialog
    ) {
        this.data = {};
    }

    login(){
        
    }


}
