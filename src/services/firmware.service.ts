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

  constructor() { 


  }

  createFirmware(zipBase64:any){
    console.log('ZIP BASE 64 : !',zipBase64)
  }

  getFirmware(zipBase64:any){
    console.log('ZIP BASE 64 : !',zipBase64)
  }
}
