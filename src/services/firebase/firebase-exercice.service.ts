import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FireStoreServiceExercice } from '../firebase/firestore-exercices.service';



@Injectable({ providedIn: 'root' })
export class FirebaseExerciceService {
  private dbPath = '/users';
  exercices!: AngularFirestoreCollection<any>;
  maDate = new Date();
  idexo : any;
  idInfos:any;
  idProps:any;
  idSpecs:any;
  idBlanket:any;
  idPodsSettings:any;
  idStepsSettings:any;
  user:any;
  cardFireStore:any =[];
  cardInfoStore:any =[];
  cardPropertyStore:any=[];
  cardSpecificationStore:any=[];
  cardPodsSetting:any=[];
  cardStepSetting:any=[];

  constructor(private fireStoreService:FireStoreServiceExercice,private datePipe: DatePipe, private db: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log('start with json: ',   this.user)
  }





getInfoGLobal(){
  this.fireStoreService.getexerciseOfUser().subscribe((docSnap: any) => {
    this.cardFireStore.length =0;
         docSnap.forEach((e:any) => {
            console.log(e.data())
            console.log(e.id)
           let array = {id:e.id,data:e.data()}
            console.log('LA LONGUEUR D\'INFO STORE  :::',this.cardFireStore.length)
           this.cardFireStore.push(array);
         });
        //  this.cardInfoStore.length =0;
        //  this.cardPropertyStore.length =0;
        //  this.cardSpecificationStore.length =0;
        //  this.cardPodsSetting.length =0;
        //  this.cardStepSetting.length =0;
         for (let index = 0; index < this.cardFireStore.length; index++) {
          const element = this.cardFireStore[index];
          setTimeout(() => {
            this.fireStoreService.getexerciseInfoOfUserAndId(element.id).subscribe((docSnap: any) => {
              docSnap.forEach((e:any) => {
                let array = {id:e.id,data:e.data()}
                this.cardInfoStore.push(array);
              });
            });

             this.fireStoreService.getexercisepropertyOfUserAndId(element.id).subscribe((docSnap: any) => {
              docSnap.forEach((e:any) => {
                let array = {id:e.id,data:e.data()}
                this.cardPropertyStore.push(array);
              });
            });

             this.fireStoreService.getexerciseSpecificationOfUserAndId(element.id).subscribe((docSnap: any) => {
              docSnap.forEach((e:any) => {
                let array = {id:e.id,data:e.data()}
                this.cardSpecificationStore.push(array);
              });
            });

             this.fireStoreService.getexercisePodsSettingsOfUserAndId(element.id).subscribe((docSnap: any) => {
              docSnap.forEach((e:any) => {
                let array = {id:e.id,data:e.data()}
                this.cardPodsSetting.push(array);
              });
            });
            this.fireStoreService.getexerciseStepsSettingsOfUserAndId(element.id).subscribe((docSnap: any) => {
             docSnap.forEach((e:any) => {
               let array = {id:e.id,data:e.data()}
               this.cardStepSetting.push(array);
             });
           });
          }, 150);
        }
        setTimeout(() => {
          console.log('on recup les datas :: ')
          console.log(this.cardFireStore)
          console.log(this.cardInfoStore)
          console.log(this.cardPodsSetting)
          console.log(this.cardPropertyStore)
          console.log(this.cardStepSetting)
          console.log(this.cardSpecificationStore)
          return this.cardFireStore;
          // this.letInject()
         }, 250);
  });
}
}
