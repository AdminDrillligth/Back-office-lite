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
export class UserHandlerHistoricalService {

  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";

  constructor(
    private utilsService:UtilsService,
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private datePipe: DatePipe,
    private db: AngularFirestore

  ) { 


  }
  

  getResultsList(id:any){
    console.log('get Results with this id: !',id)
    let token = localStorage.getItem('token') || '{}';
    let response =   this.http.get(this.baseURL+'getResultsList', {'headers':{ 'token': token, 'id':id}})
    response.subscribe((resp:any)=>{
      console.log(resp)
    })
    console.log('LA REP DU GET Results : ! ',response)
    return response;
  }

}
