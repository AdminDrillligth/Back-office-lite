import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { FireStoreServiceImages } from '../services/firebase/firestoreservice-images';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GocardlessService {
  headers = { 'content-type': 'application/json'}
  baseURL: string = "http://localhost:3000/";

  constructor(
    private http:HttpClient,
    private fireStoreServiceImages:FireStoreServiceImages,
    private datePipe: DatePipe
  ) { }

  getClientsGocard(){
    return new Promise<any>((resolve, reject) => {
      this.http.get(this.baseURL+'cardless/create_request').subscribe((rep:any) =>{
        console.log('LA REP DU GOCARDLESS : ! ',rep)
        // localStorage.setItem('account-datas', JSON.stringify(rep.userhandlerAllProfils));
        // let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
        // console.log('LA REP DU ALL USERS : ! ',allAccounts)
        // this.utilsService.sendRequestGetnewAccount(true);
      })
    })

  }

}
