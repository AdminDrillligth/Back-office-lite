import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class FireStoreServiceVideos {
  private dbPath = '/users';
  videos!: AngularFirestoreCollection<any>;
  maDate = new Date();

  user:any;
  idvideo:any;
  idInfoVideo:any;
  idPropertyVideo:any;
  idVideoTags:any;
  name: any;
  constructor(private router:Router,private datePipe: DatePipe, private db: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('users') || '{}');
  }

  url :any;
  idGeneralIdentifier:any;
  type:any;
  addVideo(name:any, url:any) {
    localStorage.removeItem('idvideo');
    this.url = url
    this.name = name;
    return new Promise<any>((resolve, reject) => {
      // L'identification de la vidéo avec la sauvegarde de son url en base
      this.db.collection('videos').add({ usermail: this.user ,name:name, url:url, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS')}).then(
          (r: any) => {
            localStorage.setItem('idvideo', JSON.stringify(r.id));
            this.idvideo = JSON.parse(localStorage.getItem('idvideo') || '{}');
            console.log('idvideo :: ',this.idvideo)
            this.addInfosVideo(this.idvideo);
          },
          (err: any) => reject(err)
        );
    });
  }

  addVideoYoutube(title:any, thumbnails:any, time:any, id:any, desc:any) {
    localStorage.removeItem('idvideo');

    // this.url = url
    this.name = name;

    console.log('LA créa de notre club: :: ',this.idGeneralIdentifier);
    return new Promise<any>((resolve, reject) => {
      // L'identification de la vidéo avec la sauvegarde de son url YOUTUBE en base
      this.db.collection('videos-youtube').add({id_general_identifier:this.idGeneralIdentifier, type: this.type, usermail: this.user ,title:title, thumbnails:thumbnails,time:time,id:id, desc:desc, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS')}).then(
          (r: any) => {
            localStorage.setItem('idvideo', JSON.stringify(r.id));
            this.idvideo = JSON.parse(localStorage.getItem('idvideo') || '{}');
            this.addTagVideoYoutube(this.idvideo)
          },
          (err: any) => reject(err)
        );
    });
  }

  addInfosVideo(idOfVideo: any) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('video-infos').add({  usermail: this.user,name:this.name, url:this.url, id_video: idOfVideo, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'), dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS')}).then(
          (r: any) => {
            localStorage.setItem('id-video-inf', JSON.stringify(r.id));
            this.idInfoVideo = JSON.parse(localStorage.getItem('id-video-inf') || '{}');
          },
          (err: any) => reject(err)
        );
    });
  }

  addTagVideo(idProp: any){
    // Chacun des Tags est sauvegardé avec ses spécifications
    return new Promise<any>((resolve, reject) => {
      this.db.collection('video-tags').add({ usermail: this.user,id_video: this.idvideo, id_infos: this.idInfoVideo,id_property: this.idPropertyVideo, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-video-tags', JSON.stringify(r.id));
            this.idVideoTags = JSON.parse(localStorage.getItem('id-video-tags') || '{}');
            // this.addBlanketExercise(this.idVideoTags);
            this.addKeyMomentsVideo(this.idVideoTags);
          },
          (err: any) => reject(err)
        );
    });
  }

  addTagVideoYoutube(idProp: any){
    // Chacun des Tags est sauvegardé avec ses spécifications
    return new Promise<any>((resolve, reject) => {
      this.db.collection('video-tags').add({ usermail: this.user,id_video: this.idvideo, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-video-tags', JSON.stringify(r.id));
            this.idVideoTags = JSON.parse(localStorage.getItem('id-video-tags') || '{}');
            // this.addBlanketExercise(this.idVideoTags);
            // this.addKeyMomentsVideo(this.idVideoTags);
          },
          (err: any) => reject(err)
        );
    });
  }


  addKeyMomentsVideo(idProp: any){
    // Chacun des moments clés est sauvegardé avec ses spécifications
    return new Promise<any>((resolve, reject) => {
      this.db.collection('video-keymoments').add({ usermail: this.user,id_exercice: this.idvideo, id_infos: this.idInfoVideo,id_property: this.idPropertyVideo, id_tag:this.idVideoTags,date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, ' yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            // localStorage.setItem('id-video-tags', JSON.stringify(r.id));
            // this.idVideoTags = JSON.parse(localStorage.getItem('id-video-tags') || '{}');
            // this.addBlanketExercise(this.idVideoTags);
          },
          (err: any) => reject(err)
        );
    });
  }

  // Update Info de la video en base, Id etant celui de l'entrée en base, data est un objet à relier avec les clefs
  updateInfoExercice(idOfVideoInfo: any, data:any) {
    console.log('onupdatelesinfos', idOfVideoInfo, data)
    return new Promise<any>((resolve, reject) => {
      this.db.collection('video-infos').doc(idOfVideoInfo).update(data).then(
          (res: any) => {
            // console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  // Update directement, via L'id de la video associée
  updateInfoVideoWithIdex(id: any,data:any){
    let idVideoInfo:any;
    console.log(data, id)
    let datas = {lastupdate:this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),lastupdateIso :this.datePipe.transform(this.maDate,'yyyy-MM-ddTHH:mm:ss.SSS'), comment:data.comment, etiquette:data.etiquette,title:data.title, selectedTraineds:data.selectedTraineds}
    this.db.collection("video-infos", ref => ref.where('id_video', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => { if(arg){
        idVideoInfo = e.id;
        setTimeout(() => { this.db.collection('video-infos').doc(idVideoInfo).update(datas) }, 200);}})
    )
  }

  updateTagsVideo(idOfVideo: any, data:any) {
   return new Promise<any>((resolve, reject) => {
      this.db.collection('video-tags').doc(idOfVideo).update(data).then(
          (res: any) => {
           console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  updateTagsVideoWithIdex(id: any, data:any){
    let idPropVideo:any
    console.log('ON VA SAVE:: ::',id, data)
    this.db.collection("video-tags", ref => ref.where('id_infos', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idPropVideo = e.id;
        console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('video-tags').doc(idPropVideo).update(data)
        }, 200);}
    })
    )
   }

   updateKeyMomentsVideo(idOfVideo: any, data:any) {
    return new Promise<any>((resolve, reject) => {
       this.db.collection('video-keymoments').doc(idOfVideo).update(data).then(
           (res: any) => {
            console.log('ep:', res);
           },
           (err: any) => reject(err)
         );
     });
   }

   updateKeyMomentsVideoWithIdex(id: any, data:any){
     let idPropVideo:any
     this.db.collection("video-keymoments", ref => ref.where('id_video', '==', id)).get().subscribe((arg: any) =>
     arg.forEach((e:any) => {
       if(arg){
         idPropVideo = e.id;
         console.log('on test:  ',e.id)
         setTimeout(() => {
           this.db.collection('video-keymoments').doc(idPropVideo).update(data)
         }, 200);}
     })
    )
  }

  getInfoVideos(idOfVideo: any) {
    return this.db.collection('video-infos').doc(idOfVideo).get();
  }

  getVideoOfUser(){
   return this.db.collection("video-infos", ref => ref.where('usermail', '==', this.user)).get()
  }

  getVideoOfUserWithID(idvideo:any){
    return this.db.collection("video-infos", ref => ref.where('id_video', '==', idvideo)).get()
   }
  
  getVideoYoutubeOfUser(){
    return this.db.collection("videos-youtube", ref => ref.where('usermail', '==', this.user)).get()
   }

  getVideoInfoOfUserAndId(id: any){
    return  this.db.collection("video-infos", ref => ref.where('id_video', '==', id)).get()
  }

  getVideoTagsOfUserAndId(id: any){
    return  this.db.collection("video-tags", ref => ref.where('id_infos', '==', id)).get()
  }

  deleteVideoFromId(id:any) {
    this.db.collection('video-infos').doc(id).delete()
  }
}

