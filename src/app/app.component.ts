import { Component,ViewChild } from '@angular/core';
import { Platform,Nav,IonicApp,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AudioProvider} from '../providers/audio/audio';

import {Toast} from '@ionic-native/toast';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any = 'dashboard';
    backButtonPressed: boolean = false; 
    @ViewChild(Nav) nav: Nav;
    options : any;
    constructor(
        private platform: Platform, 
        statusBar: StatusBar, 
        splashScreen: SplashScreen,
        private ionicApp : IonicApp,
        private toast : Toast,
        private nativePageTransitions: NativePageTransitions,
        private audioProvider : AudioProvider,
        private menuCtrl : MenuController,
        private translate : TranslateService
    ) {
        this.translate.use('en');
        platform.ready().then(() => {
        statusBar.styleDefault();
            splashScreen.hide();
            this.registerBackButtonAction();
            this.audioProvider.preload();
        });
        

    }

    push(page){
        this.audioProvider.play();
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
        this.nativePageTransitions.slide(options);
        this.nav.setRoot(page);
    }

    registerBackButtonAction() {
     	this.platform.registerBackButtonAction(() => {

       // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
       let activePortal = this.ionicApp._modalPortal.getActive();
       if (activePortal) {
         activePortal.dismiss().catch(() => {});
         activePortal.onDidDismiss(() => {});
         return;
       }
			return this.nav.canGoBack() ? this.nav.pop() : this.showExit();
     }, 1);
    }

    showExit() {
        if (this.backButtonPressed) {
            this.platform.exitApp();
        } else {
            this.toast.show('Press again to exit application','2000','top').subscribe(
                () => {}
            );
            //this.msg.presentToast('Press again to exit application',2000,'bottom');
            this.backButtonPressed = true;
            setTimeout(() => this.backButtonPressed = false, 2000);
        }
    }

    logout(){
        console.log('logout');
    }

    playSound(){
        this.audioProvider.play();
    }

    enableAuthenticatedMenu() {
        this.menuCtrl.enable(true, 'authenticated');
        this.menuCtrl.enable(false, 'unauthenticated');
    }
}

