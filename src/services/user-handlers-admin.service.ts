import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { FireStoreServiceImages } from '../services/firebase/firestoreservice-images';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserHandlersServiceAdmin {
  maDate = new Date();
  user:any;

  constructor(
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private router:Router,
    private datePipe: DatePipe,
    private db: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.user.email

  }
  headers = { 'content-type': 'application/json'}
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";
  addAccountAdmin(data:any){
    const body = JSON.stringify({data:data});
    console.log('LE BODY DE NOTRE JSON ::  ',body)

    this.http.post(this.baseURL+'user' , body,{'headers':this.headers})
    .subscribe((response:any) => {
      console.log('LA REP DU SERVEUR : ADD ACCOUNT ! ',response)
      // this.http.get(this.baseURL+'administration/all_users').subscribe((rep:any) =>{
      //   console.log('LA REP DU ALL USERS : ! ',rep)
      //   localStorage.setItem('account-datas', JSON.stringify(rep.userhandlerAllProfils));
      // })
      //          localStorage.setItem('new-account', JSON.stringify(r.id));
    //          let newaccount = JSON.parse(localStorage.getItem('new-account') || '{}');
    //          console.log('NEW ACCOUND ID ',newaccount);
    //          if(data.avatarimages !== "" || data.avatarimages !== undefined){
    //           this.fireStoreServiceImages.addImagesOfAdministrator(newaccount, data.avatarimages);
            // }
    })
  }

  updateModarations(){

  }

  updateAccountAdmin(idAccount:any, data:any){
    console.log('USE DATA OF ADMIN UPDATE : !',data)
    const body = JSON.stringify({data:data, id:idAccount});
    console.log(body)
    this.http.post(this.baseURL+'user' , body,{'headers':this.headers})
    .subscribe((response:any) => {
      console.log('LA REP DU SERVEUR : UPDATE ACCOUNT : ! ',response,  response.id)
    //          localStorage.setItem('new-account', JSON.stringify(r.id));
    //          let newaccount = JSON.parse(localStorage.getItem('new-account') || '{}');
    //          console.log('NEW ACCOUND ID ',newaccount);
    //          if(data.avatarimages !== "" || data.avatarimages !== undefined){
    //           this.fireStoreServiceImages.addImagesOfAdministrator(newaccount, data.avatarimages);
    //         }
    })
}


  updateAccountAdminWithEmailLastUpdate(emailFormControl:any,ipAddress:any) {
    let IpAdressInside:any[] = []
    this.user = emailFormControl;
    let warning =  'false';
    console.log('Last Update ??', this.user)
    localStorage.setItem('user', JSON.stringify({email:emailFormControl, timeStamp: '', timerMilli:1200000}));
    return new Promise<any>((resolve, reject) => {
    // this.db.collection("account-handler", ref => ref.where('email', '==', emailFormControl)).get().subscribe((arg: any) =>
    //    arg.docs.forEach((e:any) => {
    //       console.log("Data : ", arg.docs[0].data());
    //       localStorage.setItem('account', JSON.stringify(arg.docs[0].data()));

    //     if(arg){ let  id = e.id;
    //       if(arg.docs[0].data().moderate !== null){
    //         if(arg.docs[0].data().moderate !== undefined){
    //           if(arg.docs[0].data().moderate.moderatereason.moderate === true){
    //             console.log('IL EST MODERE')
    //             warning = 'modéré'
    //           }
    //         }

    //       }
    //       if(arg.docs[0].data().ipAddress !== undefined ){
    //         IpAdressInside = arg.docs[0].data().ipAddress;
    //         if(IpAdressInside.length === 4){
    //           const result = IpAdressInside.filter(ip => ip !== ipAddress);
    //           if(result.length !== 0){
    //             console.log('Alert');
    //             warning = 'true';
    //           }
    //         }
    //         if(IpAdressInside.length < 4){
    //           const result = IpAdressInside.filter(ip => ip === ipAddress);
    //           if(result.length === 0){
    //             IpAdressInside.push(ipAddress);
    //             warning = 'false';
    //           }
    //         }
    //       }else{
    //         IpAdressInside.push(ipAddress);
    //       }
    //     setTimeout(() => {
    //       resolve(warning)
    //        this.db.collection('account-handler').doc(id).update({warning:warning, ipAddress:IpAdressInside,lastconnexion: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),lastcodateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')})
    //     }, 200);
    //   }
    //   })
    //   )

    })
  }

  sendCsvToApi(body:any){
    console.log('BODY RECEIVED :! ',body);
    this.http.post(this.baseURL+'charts/post_csv_econe' , body,{'headers':this.headers})
    .subscribe((response:any) => {
      console.log('LA REP DU SERVEUR CSV: ! ',response)
    })
  }

  getAccountAdmin() {
    return this.db.collection('account-handler').get();
  }

  getAccountWithEmail(emailUser:any) {
    return  this.db.collection("account-handler", ref => ref.where('email', '==', emailUser)).get()

  }

}
