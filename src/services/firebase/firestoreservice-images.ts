import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class FireStoreServiceImages {
  images!: AngularFirestoreCollection<any>;
  maDate = new Date();

  user:any;
  idimages:any;
  idInfoImages:any;
  idPropertyImages:any;
  idimagesTags:any;
  name: any;
  constructor(
    private storage: AngularFireStorage,
    private router:Router,
    private datePipe: DatePipe,
    private db: AngularFirestore
    ) {
    this.user = JSON.parse(localStorage.getItem('users') || '{}');
  }

  url :any;
  idGeneralIdentifier:any;
  type:any;
  addImagesOfCustomers(idAccount:any, data:any) {
    console.log(data, idAccount )
    let dataupdate = {}
    localStorage.removeItem('idimage');
    // return new Promise<any>((resolve, reject) => {
    //   const file = data.target.files[0];
    //   // found PRIVATE OR NOT
    //   const filePath = '/customers-avatar/'+file.name;
    //   const fileRef = this.storage.ref(filePath);
    //   const task = this.storage.upload(filePath, file);
    //   task.snapshotChanges().pipe(
    //     finalize(() =>
    //     fileRef.getDownloadURL().subscribe(url => {
    //     dataupdate = {avatarimages: url}
    //     console.log('INIT URL AFTER UPDATE',dataupdate)
    //     this.db.collection('account-handler').doc(idAccount).update(dataupdate)
    //     setTimeout(() => {
    //     }, 300);
    //   })
    // )
    // ).subscribe()
    // });
  }

  addImagesOfAdministrator(idAccount:any, data:any) {
    let dataupdate = {}
    console.log(data, idAccount )
    localStorage.removeItem('idimage');
    return new Promise<any>((resolve, reject) => {
      if(data !== undefined){
        const file = data.target.files[0];
        // found PRIVATE OR NOT
        const filePath = '/admins-avatar/'+file.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        task.snapshotChanges().pipe(
          finalize(() =>
          fileRef.getDownloadURL().subscribe(url => {
          dataupdate = {avatarimages: url}
          console.log('INIT URL AFTER UPDATE',dataupdate)
          this.db.collection('account-handler').doc(idAccount).update(dataupdate)
          setTimeout(() => {
          }, 300);
        })
      )
      ).subscribe()
      }

    });
  }

  // addInfosVideo(idOfVideo: any) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.db.collection('video-infos').add({  usermail: this.user,name:this.name, url:this.url, id_video: idOfVideo, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'), dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS')}).then(
  //         (r: any) => {
  //           localStorage.setItem('id-video-inf', JSON.stringify(r.id));
  //           this.idInfoImages = JSON.parse(localStorage.getItem('id-video-inf') || '{}');
  //         },
  //         (err: any) => reject(err)
  //       );
  //   });
  // }


  // // Update Info de la video en base, Id etant celui de l'entrée en base, data est un objet à relier avec les clefs
  // updateInfoExercice(idOfVideoInfo: any, data:any) {
  //   console.log('onupdatelesinfos', idOfVideoInfo, data)
  //   // return new Promise<any>((resolve, reject) => {
  //   //   this.db.collection('video-infos').doc(idOfVideoInfo).update(data).then(
  //   //       (res: any) => {
  //   //         // console.log('ep:', res);
  //   //       },
  //   //       (err: any) => reject(err)
  //   //     );
  //   // });
  // }



  // getInfoImages(idOfVideo: any) {
  //   return this.db.collection('image-infos').doc(idOfVideo).get();
  // }

  // getImagesOfUser(){
  //  return this.db.collection("image-infos", ref => ref.where('usermail', '==', this.user)).get()
  // }

  deleteImagesFromId(id:any) {
    this.db.collection('images-infos').doc(id).delete()
  }
}

