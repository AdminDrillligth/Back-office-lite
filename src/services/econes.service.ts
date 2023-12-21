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

    addEcones(data:any){
      let token = localStorage.getItem('token') || '{}';
      console.log('LE TOKEN',token);
      const body = JSON.stringify({data:data, token:token});
      this.http.post(this.baseURL+'econe' , body,{'headers':this.headers}).subscribe((response:any) => {
        console.log('LA REP DU SERVEUR : ! ',response)
        if(response.decodeds !== 'err'){
          this.getAllEcones();
        }else{
          console.log('veuillez vous réedentifier ! ')
        }
      })
    }

    updateEconesToDatabase(){

    }

    getAllEcones(){
      let token = localStorage.getItem('token') || '{}';
      console.log('LE TOKEN',token);
       this.http.get(this.baseURL+'econe' ,{'params':{'token':token}}).subscribe((response:any) => {
        console.log('LA REP DU SERVEUR : ! ',response)
        if(response.decodeds !== 'err'){
          this.utilsService.seeEconesList(response.ListEcones);
        }else{
          console.log('veuillez vous réedentifier ! ')
        }
      })
    }
    
}
