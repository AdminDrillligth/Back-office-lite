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

export class FirmWareService {
  maDate = new Date();
  user:any;

  headers = { 'content-type': 'application/json'};
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";

  constructor(
    private utilsService:UtilsService,
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private datePipe: DatePipe,
    private db: AngularFirestore

  ) { 


  }

  createFirmware(firmwareData:any, id:any, privated:boolean){
    let token = localStorage.getItem('token') || '{}';
    // console.log('ZIP BASE 64 : !',zipBase64)
    const body = JSON.stringify({firmwareData:firmwareData, id:id, privated:privated});
    console.log(body);
    this.http.post(this.baseURL+'createFirmware', body,{'headers':{ 'token': token}}).subscribe((rep:any) =>{
      console.log('LA REP DU CREATE FIRMWARE : ! ',rep)
    });

  }

  getFirmware(id:any){
    console.log('get firmware with this id: !',id)
    let token = localStorage.getItem('token') || '{}';
    this.http.get(this.baseURL+'getFirmware', {'headers':{ 'token': token, 'id':id, 'firmwareid':'063a8ffd-b0bd-46bd-9587-7226b1bc6dd3'}}).subscribe((rep:any) =>{
      console.log('LA REP DU GET FIRMWARE : ! ',rep)
    });
  }

  getFirmwareList(){
    console.log('get la list')
    let token = localStorage.getItem('token') || '{}';
    this.http.get(this.baseURL+'getFirmwaresList', {'headers':{ 'token': token}}).subscribe((rep:any) =>{
      console.log('LA REP DU GET FIRMWARELIST : ! ',rep)
    });
  }

  getfirmwareDetails(account:any){
    console.log('Le account : ! ',account)
    let token = localStorage.getItem('token') || '{}';
    // this.http.get(this.baseURL+'getFirmwareDetails', {'headers':{ 'token': token, 'id':id, 'firmwareid':'063a8ffd-b0bd-46bd-9587-7226b1bc6dd3'}}).subscribe((rep:any) =>{
    //   console.log('LA REP DU GET FIRMWAREDETAILS : ! ',rep)
    // });
  }

}
