import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GenericProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GenericProvider {
    host : string = 'http://localhost:8000/v1/';
    //host : string = 'http://192.168.43.71/ionic/MyMoneyBackend/public/v1/';
    //host : string = 'http://mymoney.samuel07.xyz/public/v1/';
    param : any;
    url : any;
    constructor(public http: Http) {
        this.param = {};
        this.url = '';
    }

    public getHost(){
        return this.host;
    }

    public loadRevenue(param){
        this.param = param;
        this.url = this.host+"revenue/load";
        return this.postData();
    }

    public loadExpenses(param){
        this.param = param;
        this.url = this.host+"expenses/load";
        return this.postData();
    }

    public saveTransaction(param){
        this.param = param;
        this.url = this.host+"transaction/save";
        return this.postData();
    }

    public viewTransaction(param){
        this.param = param;
        this.url = this.host+"transaction/view/"+param.id;
        return this.postData();
    }

    public deleteTransaction(param){
        this.param = param;
        this.url = this.host+"transaction/delete/"+param.id;
        return this.postData();
    }

    public loadCategoryRevenue(param){
        this.param = param;
        this.url = this.host+"category/revenue/load";
        return this.postData();
    }

    public loadCategoryExpenses(param){
        this.param = param;
        this.url = this.host+"category/expenses/load";
        return this.postData();
    }

    public loadCategory(param){
        this.param = param;
        this.url = this.host+"category/load";
        return this.postData();
    }

    public viewCategory(param){
        this.param = param;
        this.url = this.host+"category/view/"+param.id;
        return this.postData();
    }

    public deleteCategory(param){
        this.param = param;
        this.url = this.host+"category/delete/"+param.id;
        return this.postData();
    }

    public saveRevenue(param){
        this.param = param;
        this.url = this.host+"transaction/revenue/save";
        return this.postData();
    }

    public saveExpenses(param){
        this.param = param;
        this.url = this.host+"transaction/expenses/save";
        return this.postData();
    }

    public saveCategory(param){
        this.param = param;
        this.url = this.host+"category/save";
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
