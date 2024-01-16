import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { FireStoreServiceImages } from './firebase/firestoreservice-images';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
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
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.user.email
  }


  updateExercise(json:any, id:any){
    let token = localStorage.getItem('token') || '{}';

    console.log('LE TOKEN',token,json,id );
    // header = 
    const body = JSON.stringify({json:json, id:id});
    console.log(body)
    this.http.post(this.baseURL+'createExercise', body,{'headers':{ 'token': token}}).subscribe((rep:any) =>{
      console.log('LA REP DU ALL USERS : ! ',rep)

      // let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
      // // console.log('LA REP DU ALL USERS : ! ',allAccounts)
      // this.utilsService.sendRequestGetnewAccount(true);
    })
  }

}