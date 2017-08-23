import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {ConstantProvider} from '../constant/constant';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

    host : any;
    param : any;
    url : any;
    constructor(public http: Http,private constant : ConstantProvider) {
        this.param = {};
        this.url = '';
        this.host = this.constant.getHost();
    }

    public login(param){
        this.param = param;
        this.url = this.host+"auth/login";
        return this.postData();
    }

    public register(param){
        this.param = param;
        this.url = this.host+"auth/register";
        return this.postData();
    }

    public logout(param){
        this.param = param;
        this.url = this.host+"auth/logout";
        return this.postData();
    }

    private postData(){
        let param = {
			data : this.param
		};
		return new Promise(resolve => {
			this.http.post(this.url,param).subscribe(data => {
                //let r = data.json();
				resolve(data.json());
			},
			err => {
                //let r : any = err;
                //let parse = JSON.parse(r._body);
				resolve(err.json());
			});
		});
    }

}
