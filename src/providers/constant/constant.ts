import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ConstantProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConstantProvider {
    //ost : string = 'http://192.168.43.71/v1/';
    //host : string = 'http://192.168.43.71/ionic/MyMoneyBackend/public/v1/';
    host : string = 'http://mymoney.samuel07.xyz/public/v1/';
    author : any;

    constructor(public http: Http) {
        console.log('Hello ConstantProvider Provider');
        this.author = {
            name : 'Samuel Hermawa',
            email : 'samuelhermawan07@gmail.com',
            website : 'samuel07.xyz'
        };
    }

    public getHost(){
        return this.host;
    }

    public getAuthor(){
        return this.author;
    }

}
