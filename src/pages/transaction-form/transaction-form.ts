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
    ) {
        this.images = [];
        this.data = {
            id : this.navParams.get('id'),
            amount : 0,
            category_type : this.navParams.get('category_type'),
            description : '',
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
            },
            (err) => {
                let result : any = err;
                this.toast.show(result.msg,'2000','top').subscribe(() => {});
            }
        );
    }

    selectCategory(){
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
        if(this.images.length > 0){
            let cons = this.generic.getHost();
            let url = cons+"uploadImage";
            let path = '';
            let filename = '';
            //path = cordova.file.dataDirectory + this.images[i].image;
            path = this.images[0].image;
            filename = this.images[0].image;
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
                this.data.image_uploaded = res.data;
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
                    this.images.push({
                        image_preview : results[i],
                        image : results[i],
                        image_uploaded : '',
                    });
                    this.data.image_preview = results[i];
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
            //this.data.imagePreview = 'data:image/jpeg;base64,' + imagePath;
            this.data.imageUploaded = '';
            if(this.images.length <5){
                if(this.images.length == 0){
                    this.data.imagePreview = imagePath;
                }
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                var name = this.createFileName();
                this.copyFileToLocalDir(correctPath, currentName, name);
                this.images.push({
                    image_preview : imagePath,
                    image : name,
                    image_uploaded : ''
                });
                this.data.image_preview = imagePath;
            }
        }, (err) => {
        });
    }

    private createFileName() {
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";
        return newFileName;
    }

    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            //this.lastImage = newFileName;
        }, error => {
            this.toast.show('Error whilte storing file','2000','top').subscribe(() => {});
            //this.presentToast('Error while storing file.');
        });
    }

    removeImage(){
        this.images.splice(0,1);
        this.data.image_preview = undefined;
        this.data.image_uploaded = undefined;
    }
}
