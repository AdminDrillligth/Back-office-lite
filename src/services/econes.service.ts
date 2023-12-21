import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})


export class EconesService {
  maDate = new Date();
  user:any;
  headers = { 'content-type': 'application/json'}
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";

  constructor(
    private utilsService:UtilsService,
    private http:HttpClient,
     private router:Router, 
     private datePipe: DatePipe, 
     private db: AngularFirestore) 
    { 
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.user = this.user.email
    }

    addEconesToDatabaseWithCustomer(serial:any, uuidOfCustomer:any){
      let uuid = uid(32);
      let podsData : any[any]= [];
      console.log(uuidOfCustomer, serial)
      this.db.collection("account-handler", ref => ref.where('uuid', '==', uuidOfCustomer)).get().subscribe((arg: any) =>{
        arg.docs.forEach((e:any) => {
          if(e.data().econes === undefined || e.data().econes.length === undefined || e.data().econes.length === 0){ 
            podsData.push({
              seeQr:false,
              serial:serial,
              uuid:uuid,
              dateOfAssignement: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
              dateIsoOfAssignement: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')
            })
            this.db.collection('account-handler').doc(e.id).update({econes:podsData})
          }else{
              podsData.push({
                seeQr:false,
                serial:serial,
                uuid:uuid,
                dateOfAssignement: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
                dateIsoOfAssignement: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')
              })
              e.data().econes.forEach((pod:any) =>{
                podsData.push(pod);
              })
              console.log('PODS DATA TO',podsData)
              this.db.collection('account-handler').doc(e.id).update({econes:podsData})
          }
        })
      })
      return new Promise<any>((resolve, reject) => {
        this.db.collection('e-cones').add({
          seeQr:false,
          serial:serial,
          uuid:uuid,
          uuidOfCustomer:uuidOfCustomer,
          date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
          dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')
        }).then(
            (r: any) => { },
            (err: any) => reject(err));
      });
    }

    addEconesToDatabase(serial:any){
      let uuid = uid(32);
      console.log(serial)
      return new Promise<any>((resolve, reject) => {
        this.db.collection('e-cones').add({
          seeQr:false,
          serial:serial,
          uuid:uuid,
          date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
          dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')
        }).then(
            (r: any) => { },
            (err: any) => reject(err));
      });
    }

    updateEconesToDatabase(){

    }

    getAllEcones(){
      let token = localStorage.getItem('token') || '{}';
      console.log('LE TOKEN',token);
      this.http.get(this.baseURL+'econe' ,{'params':{'token':token}}).subscribe((response:any) => {
        console.log('LA REP DU SERVEUR : ! ',response)
      })
      return this.db.collection('e-cones').get();
    }
}
