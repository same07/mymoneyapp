import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { NativeAudio } from '@ionic-native/native-audio';

/*
  Generated class for the AudioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AudioProvider {

  audioType: string = 'html5';
    sounds: any = [];
    asset : string = 'assets/audio/click.mp3';
    key : string = 'click';
    constructor(public nativeAudio: NativeAudio, platform: Platform) {
 
        if(platform.is('cordova')){
            this.audioType = 'native';
        }
 
    }
 
    preload() {
 
        if(this.audioType === 'html5'){
 
            let audio = {
                key: this.key,
                asset: this.asset,
                type: 'html5'
            };
 
            this.sounds.push(audio);
 
        } else {
 
            this.nativeAudio.preloadSimple(this.key, this.asset);
 
            let audio = {
                key: this.key,
                asset: this.key,
                type: 'native'
            };
 
            this.sounds.push(audio);
        }       
 
    }
 
    play(){
 
        let audio = this.sounds.find((sound) => {
            return sound.key === this.key;
        });
 
        if(audio.type === 'html5'){
 
            let audioAsset = new Audio(audio.asset);
            audioAsset.play();
 
        } else {
 
            this.nativeAudio.play(audio.asset).then((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });
 
        }
 
    }

}
