import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { FireStoreServiceImages } from '../services/firebase/firestoreservice-images';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserHandlersServiceCustomer {
  maDate = new Date();
  user:any;

  headers = { 'content-type': 'application/json'}
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";
  constructor(
    private utilsService:UtilsService,
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private datePipe: DatePipe,
    private db: AngularFirestore
    ) {
    this.user = JSON.parse(localStorage.getItem('account') || '{}');
    this.user = this.user.id
  }


  getUpdateallUsers(){
    let token = localStorage.getItem('token') || '{}';
    this.http.get(this.baseURL+'getAccountsList' ,{'headers':{token:token, id:this.user}}).subscribe((response:any) => {
      if(response.response.result === "success"){
        localStorage.setItem('accounts-data', JSON.stringify(response.accounts));
        // console.log('LIST DES USERS : ! ', response.accounts)
        this.utilsService.sendRequestGetnewAccount(true);
      }
    })
  }

  async getAccounts(){
    console.log('we get all accounts : ! ! ');
    let token = localStorage.getItem('token') || '{}';
    this.http.get(this.baseURL+'getAccountsList' ,{'headers':{token:token, id:this.user}}).subscribe((response:any) => {
      if(response.response.result === "success"){
        localStorage.setItem('accounts-data', JSON.stringify(response.accounts));
        // console.log('LIST DES USERS : ! ', response.accounts)
        this.utilsService.sendRequestGetnewAccount(true);
      }
    })
  }


  async getAccountDetails(id:string){
    console.log(id)
    let token = localStorage.getItem('token') || '{}';
    let header = {'id':id, 'token':token }
    let response = await this.http.get(this.baseURL+'getAccountDetails', {'headers':header} )
    return response;
  }

  setPasswordHash(email:any, passwordHash:any){
    console.log('EMAIL PASSWORD: ! ', email, passwordHash)
    let headers = {'username':email , 'passwordhash':passwordHash}
    this.http.get(this.baseURL+'passwordHash', {'headers':headers} ).subscribe((response:any) => {
      console.log('LA REP : ! ',response)
      this.getTokenSession(headers);
    })
  }

  getTokenSession(headers:any){
    let headersGet = {'expiration':'24h','username':headers.username , 'passwordhash':headers.passwordhash}
    this.http.get(this.baseURL+'getToken', {'headers':headersGet} ).subscribe((response:any) => {
      console.log('LA REP AFTER TOKEN : ! ',response)
      localStorage.setItem('token', response.token);
    })
  }


  async addAccount(data:any){
    const body = {data:data};
    console.log('createAccount : ! ', body);
    let token = localStorage.getItem('token') || '{}';
    let resp =  await this.http.post(this.baseURL+'createAccount' , body)
    return resp ;
  }

  updateModarations(){

  }

  async updateAccount(data:any){
    console.log('DATA UPDATE CUSTOMER :: ',data)
    let token = localStorage.getItem('token') || '{}';
    const body = {data:data };
    console.log('On va envoyer ce body : ',body)
    let resp = await this.http.put(this.baseURL+'updateAccount' , body,{'headers':{token:token}});
    return resp ;
  }

  // addAccountTrained(idAccount:any, data:any){
  //   let trainedData : any[any]= [];
  //   trainedData.push(data.traineds)
  //   const body = JSON.stringify({data:data.traineds, account:idAccount});
  //   console.log(body)
  //   console.log('on crée le compte ! :',trainedData, data)
  //   this.http.post(this.baseURL+'administration/add_user' , body,{'headers':this.headers})
  //   .subscribe((response:any) => {
  //     console.log('LA REP DU SERVEUR : ! ',response, response.dataOfAdministrator,  response.id)
  //   });
  // }

  // addAccountStaff(idAccount:any, data:any){
  //   console.log('on crée le compte staff ! :', idAccount, data)
  //   let staffData : any[any]= [];
  //   staffData.push(data.staff)
  //   const body = JSON.stringify({data:data.staff, account:idAccount});
  //   console.log('on crée le compte staff  ! :',body)
  //   this.http.post(this.baseURL+'administration/add_staff' , body,{'headers':this.headers})
  //   .subscribe((response:any) => {
  //     console.log('LA REP DU SERVEUR : ! ',response, response.dataOfAdministrator,  response.id)
  //   });
  // }

  // updateAccountTrained(idAccount:any, data:any){
  //   console.log(" On va update !! les data de l\'entrainer a aider ? !!" ,idAccount, data)
  //   const body = JSON.stringify({data:data, account:idAccount});
  //   console.log('on update le compte trained  ! :',body)
  //   this.http.post(this.baseURL+'administration/update_user' , body,{'headers':this.headers})
  //   .subscribe((response:any) => {
  //     console.log('LA REP DU SERVEUR : ! ',response, response.dataOfAdministrator,  response.id)
  //   });
  // }



  // updateAccountStaff(idAccount:any, data:any){
  //   console.log(" On va update !! les data de l\'entrainer a aider ? !!" ,idAccount, data)
  //   const body = JSON.stringify({data:data, account:idAccount});
  //   console.log('on update le compte staff  ! :',body)
  //   this.http.post(this.baseURL+'administration/update_staff' , body,{'headers':this.headers})
  //   .subscribe((response:any) => {
  //     console.log('LA REP DU SERVEUR : ! ',response, response.dataOfAdministrator,  response.id)
  //   });
  // }


  updateAccountCunstomerWithEmailLastUpdate(ipAddress:any) {
    let IpAdressInside:any[] = []
    let warning =  'false';
    return new Promise<any>((resolve, reject) => {
      this.db.collection("account-handler", ref => ref.where('email', '==', this.user)).get().subscribe((arg: any) =>
      arg.docs.forEach((e:any) => {
        if(arg){ let  id = e.id;
          if(arg.docs[0].data().ipAddress !== undefined ){
            IpAdressInside = arg.docs[0].data().ipAddress;
            if(IpAdressInside.length === 4){
              const result = IpAdressInside.filter(ip => ip !== ipAddress);
              if(result.length !== 0){
                console.log('Alert');
                warning = 'true';
              }
            }
            if(IpAdressInside.length < 4){
              const result = IpAdressInside.filter(ip => ip === ipAddress);
              if(result.length === 0){
                IpAdressInside.push(ipAddress);
                warning = 'false';
              }
            }
          }else{
            IpAdressInside.push(ipAddress);
          }
        setTimeout(() => {
          resolve(warning)
           this.db.collection('account-handler').doc(id).update({warning:warning, ipAddress:IpAdressInside,lastconnexion: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),lastcodateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')})
        }, 200);
      }
      })
      )
    })
  }

  moderateAccountCustomer(idAccount:any, data:any){
    console.log('Modarate',idAccount.data.email,data)
    this.db.collection("account-handler", ref => ref.where('email', '==', idAccount.data.email)).get().subscribe((arg: any) =>{
      arg.docs.forEach((e:any) => {
        console.log(e,e.id)
        let  id = e.id;
        this.db.collection('account-handler').doc(id).update({moderate:{moderatereason:data,date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),lastcodateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}})
      })
    })
  }

  moderateAccountUser(idAccount:any, data:any){
    console.log('Modarate user :',idAccount.ProfilAccount ,data.uuid, data)
    idAccount.ProfilAccount.data.traineds.forEach((trained:any, index:number) => {
      if(idAccount.trained.uuid === trained.uuid){
        console.log('Modarate user :',trained, index)
        trained.moderate = {moderatereason:data,date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),lastcodateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}
      }
      console.log('TRAINEDS :: ! :',idAccount.ProfilAccount.data.traineds)
    });
    this.db.collection("account-handler", ref => ref.where('email', '==', idAccount.ProfilAccount.data.email)).get().subscribe((arg: any) =>{
      arg.docs.forEach((e:any) => {
        console.log(e,e.id)
        let  id = e.id;
        this.db.collection('account-handler').doc(id).update(idAccount.ProfilAccount.data)
      })
    })
  }


  sendCsvToApi(data:any, account:any){
    const headers = { 'content-type': 'application/CSV'}
    console.log('BODY RECEIVED :! ',data);
    let body = {data:data, account:account};
    return new Promise<any>((resolve, reject) => {
      this.http.post(this.baseURL+'charts/post_csv_econe' , body).subscribe((response:any) => {
        console.log('LA REP DU SERVEUR CSV: ! ',response)
        // const jsonDataCsvOfHistory = response.last_history;
        let bodyLastRequest = {idLastHistory:response.last_history, account:account};
        console.log(bodyLastRequest)
        this.http.post(this.baseURL+'charts/last_history_data_binding' , bodyLastRequest).subscribe((response:any) => {
          console.log('RESPONSE : ! ',response)
          resolve(response)
        });
      })
    })

  }

  sendJsonToApi(jsondata :any, id:any, account:any){
    const headers = { 'content-type': 'application/json'}
    let idSplit = id.split('.')
    let body = {data:jsondata, id:idSplit[0], account:account};
    console.log('BODY RECEIVED :! ',body);
    return new Promise<any>((resolve, reject) => {
      this.http.post(this.baseURL+'exercices/post_json_exercice' , body).subscribe((response:any) => {
        console.log('LA REP DU SERVEUR JSON: ! ',response)
        // const jsonDataCsvOfHistory = response.last_history;
        // let bodyLastRequest = {idLastHistory:response.last_history, account:account};
        // console.log(bodyLastRequest)
        // this.http.post(this.baseURL+'charts/last_history_data_binding' , bodyLastRequest).subscribe((response:any) => {
        //   console.log('RESPONSE : ! ',response)
        //   resolve(response)
        // });
      })
    })

  }

  getAccountCustomer() {
    return this.db.collection('account-handler').get();
  }

}
