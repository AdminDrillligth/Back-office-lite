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
    private router:Router,
    private utilsService:UtilsService,
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private datePipe: DatePipe,
    private db: AngularFirestore
    ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.user.email
  }


  async getExerciceList(id:any){
    let token = localStorage.getItem('token') || '{}';
    console.log('on va get les exercices ! ')
    let response = await this.http.get(this.baseURL+'getExercisesList',{'headers':{ 'token': token, 'id':id,'webapp':'1', 'publicExercisesChangeCount':'0',  'privateExercisesChangeCount':'0'}})
    response.subscribe((rep:any)=>{
      if(rep.response.result === "expiredTokenError"){
        this.utilsService.howToSeeNavigation(false);
        this.router.navigate(['']);
      }
    })
    return response;
  }


  async getSessionList(id:any){
    let token = localStorage.getItem('token') || '{}';
    console.log('on va get les Sessions ! ')
    let response = await this.http.get(this.baseURL+'getSessionsList',{'headers':{ 'token': token,'id':id,'publicSessionsChangeCount':'0', 'privateSessionsChangeCount':'0'}})
    console.log(response)
    return response;
  }

  updateExercise(json:any, id:any){
    let token = localStorage.getItem('token') || '{}';
    console.log('LE TOKEN',token,json,id );
    const body = JSON.stringify({json:json, id:id});
    console.log(body)
    this.http.post(this.baseURL+'createExercise', body,{'headers':{ 'token': token}}).subscribe((rep:any) =>{
      console.log('LA REP DU CREATE EXERCISE : ! ',rep)
    });
  }

  updateSession(json:any, id:any){
    let token = localStorage.getItem('token') || '{}';
    console.log('LE TOKEN',token,json,id );
    // header = 
    const body = JSON.stringify({json:json, id:id});
    console.log(body)
    this.http.post(this.baseURL+'createSession', body,{'headers':{ 'token': token}}).subscribe((rep:any) =>{
      console.log('LA REP DU CREATE SESSIONS : ! ',rep)

      // let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
      // // console.log('LA REP DU ALL USERS : ! ',allAccounts)
      // this.utilsService.sendRequestGetnewAccount(true);
    })
  }


}
