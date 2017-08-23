import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule, Http} from '@angular/http';


import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {Transfer} from '@ionic-native/transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {Dialogs} from '@ionic-native/dialogs';
import {Toast} from '@ionic-native/toast';
import {DatePicker} from '@ionic-native/date-picker';
import {NativePageTransitions} from '@ionic-native/native-page-transitions';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';
import { ImagePicker } from '@ionic-native/image-picker';
import { NativeAudio } from '@ionic-native/native-audio';

import {GenericProvider} from '../providers/generic/generic';
import {AuthProvider} from '../providers/auth/auth';
import { AudioProvider } from '../providers/audio/audio';
import { ConstantProvider } from '../providers/constant/constant';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
export function HttpLoaderFactory(Http: Http) {
    return new TranslateHttpLoader(Http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
        }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FilePath,
    File,
    Transfer,
    PhotoViewer,
    Dialogs,
    Toast,
    DatePicker,
    NativePageTransitions,
    SpinnerDialog,
    GenericProvider,
    AuthProvider,
    ImagePicker,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AudioProvider,
    ConstantProvider,
    TranslateStore
  ]
})
export class AppModule {}
