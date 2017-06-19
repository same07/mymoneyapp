import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ActionSheetController } from 'ionic-angular';

import {Toast} from '@ionic-native/toast';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';
import {NativePageTransitions} from '@ionic-native/native-page-transitions';
import {Dialogs} from '@ionic-native/dialogs';
import { DatePicker } from '@ionic-native/date-picker';
import { ImagePicker } from '@ionic-native/image-picker';
import {Camera} from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {Transfer} from '@ionic-native/transfer';

import {GenericProvider} from '../../providers/generic/generic';
import {AudioProvider} from '../../providers/audio/audio';

declare var cordova: any;

/**
 * Generated class for the TransactionFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name : 'transaction-form'
})
@Component({
  selector: 'page-transaction-form',
  templateUrl: 'transaction-form.html',
})
export class TransactionFormPage {

    data : any;
    images : any;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private toast : Toast,
        private generic : GenericProvider,
        private spinnerDialog : SpinnerDialog,
        private nativePage : NativePageTransitions,
        private modalCtrl : ModalController,
        private dialogs : Dialogs,
        private datepicker : DatePicker,
        private actionSheetCtrl : ActionSheetController,
        private filePath : FilePath,
        private file : File,
        private transfer : Transfer,
        private camera : Camera,
        public imagePicker : ImagePicker,
        private audioProvider : AudioProvider
    ) {
        this.images = [];
        this.data = {
            id : this.navParams.get('id'),
            amount : 0,
            category_type : this.navParams.get('category_type'),
            description : '',
            image : 'assets/images/no_image.png'
        };
        if(this.data.id != undefined){
            this.loadData();
        }
    }

    loadData(){
        this.generic.viewTransaction({id:this.data.id}).then(
            (dt) => {
                let result :any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(() => {});
                    return false;
                }
                this.data = result.data;
                this.data.image = result.data.image == undefined ? 'assets/images/no_image.png' : result.data.image;
            },
            (err) => {
                let result : any = err;
                this.toast.show(result.msg,'2000','top').subscribe(() => {});
            }
        );
    }

    selectCategory(){
        this.playSound();
        let modal = this.modalCtrl.create('category-list',{category_type :this.data.category_type});
        modal.present();
        modal.onDidDismiss(
            (dt) => {
                if(dt != undefined && dt.success){
                    this.data.category_name = dt.name;
                    this.data.category_id = dt.id;
                }
            }
        );
    }


    save(){
        this.playSound();
        if(this.data.category_type == undefined){
            this.dialogs.alert('Please select Type');
            return false;
        }
        if(this.data.amount == undefined || this.data.amount == ''){
            this.dialogs.alert('Amount is required');
            return false;
        }
        if(this.data.category_id == undefined){
            this.dialogs.alert('Please select category');
            return false;
        }
        this.spinnerDialog.show('','Please Wait',false);
        if(this.data.image_path == ''){
            let cons = this.generic.getHost();
            let url = cons+"uploadImage";
            let path = '';
            let filename = '';
            //path = cordova.file.dataDirectory + this.images[i].image;
            path = this.data.image;
            filename = this.data.image;
            var targetPath = path;
            var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : {'fileName': filename}
            };

            const fileTransfer = this.transfer.create();

            fileTransfer.upload(targetPath, url, options).then(data => {
                let result : any = data;
                let res = JSON.parse(result.response);
                this.data.image_path = res.data;
                this.saveTransaction();
            }, err => {
                this.spinnerDialog.hide();
                this.toast.show('Error while uploading image.','2000','top').subscribe(()=>{});
            });
        }else{
            this.saveTransaction();
        }

    }

    saveTransaction(){
        this.generic.saveTransaction(this.data).then(
            (dt) => {
                this.spinnerDialog.hide();
                let result : any = dt;
                if(result.error){
                    this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                    return false;
                }
                this.toast.show(result.msg,'2000','top').subscribe(()=>{});
                this.navCtrl.pop();
            },
            () => {
                this.spinnerDialog.hide();
            }
        );
    }

    selectDate(){
        this.playSound();
        this.datepicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datepicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date) => { 
                let Ndate = Intl.DateTimeFormat().format(date); 
                let date_array = Ndate.split("/");
                let month = date_array[0].length == 1 ? '0'+date_array[0] : date_array[0];
                let day = date_array[1].length == 1 ? '0'+date_array[1] : date_array[1];
                this.data.date = date_array[2]+'-'+month+'-'+day;
            },
            () => {}
        );
    }

    selectImage(){
        this.playSound();
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
            {
                text: 'Load from Library',
                handler: () => {
                    //this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    this.selectFromLib();
                }
            },
            {
                text: 'Use Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });
        actionSheet.present();
    }

    selectFromLib(){
        this.imagePicker.getPictures({quality:100,maximumImagesCount:1,outputType:0}).then((results) => {
            if(results.length > 0 ){
                for(let i = 0;i<results.length;i++){
                    this.data.image = results[i];
                    this.data.image_path = '';
                }
            }
            
        }, (err) => { 
        });
    }

    takePicture(sourceType) {
        var options = {
            quality: 100,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
 
        this.camera.getPicture(options).then((imagePath) => {
            this.data.image = imagePath;
            this.data.image_path = '';
        }, (err) => {
        });
    }


    removeImage(){
        this.playSound();
        this.images.splice(0,1);
        this.data.image_preview = undefined;
        this.data.image_uploaded = undefined;
    }

    playSound(){
        this.audioProvider.play();
    }

}
