import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class JsonDownloadServiceImages {
  maDate = new Date();
  user:any;
  name: any;
  url :any;
  idGeneralIdentifier:any;
  type:any;
  chargeFileCreator:boolean = false;
  exportDataOfCustomerJSON:any= []; 
  jsonFile:any;
  titleOfDoc:string="";
  doJson:boolean=false;

  constructor(
    private httpClient:HttpClient,
    private storage: AngularFireStorage,
    private router:Router,
    private datePipe: DatePipe,
    private db: AngularFirestore
    ) {
    // this.user = JSON.parse(localStorage.getItem('users') || '{}');
  }

createFile(){
  if(this.chargeFileCreator === false){
    this.chargeFileCreator = true;
    setTimeout(() => {
      console.log('Le fichier json::: :: a save :  en bdd:: :',this.jsonFile)
      // this.header[0].id+
        let fileName = this.titleOfDoc+'.json';
        var blob = new Blob([this.jsonFile], { type: 'application/json;charset=utf-8' });
        const filePath = '/json/'+this.titleOfDoc;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, blob);
        task.snapshotChanges().pipe(
          finalize(() =>
          fileRef.getDownloadURL().subscribe(url => {
            console.log('LURL::: ::: ',url);
            // this.firestore.updateInfoExerciceWithIdex(this.idExo, {urlJson:url})
            // this.storageserviceVideo.uploadToStorageVideo(url,event.target.files[0].name)
          })
          // console.log(this.downloadURL = fileRef.getDownloadURL())
        )
       ).subscribe()
        // observe percentage changes
        // this.uploadPercent = task.percentageChanges();
        // console.log(this.uploadPercent)
        this.download(blob,fileName);
        setTimeout(() => {
          this.chargeFileCreator = false
        }, 200);
    }, 300);
  }
}

download(blob:any, filename:any) {
  if(this.doJson === false){
   this.doJson = true;
   var a = document.createElement("a"),
   url = URL.createObjectURL(blob);
   a.href = url;
   a.download = filename;
   document.body.appendChild(a);
   a.click();
   setTimeout(function() {
     document.body.removeChild(a);
     window.URL.revokeObjectURL(url);
   }, 0);
   setTimeout(() => {
     this.doJson = false;
   }, 150);
  }

}

  filelist:any;
  downloadZIP() {
    console.log('ok on veut download');
    var zip = new JSZip();
    // zip.file("Title.txt", this.title);
    let exFolder = zip.folder("exercise");
    var sessFolder = zip.folder("session");
    var progFolder = zip.folder("program");
    // for (let i = 0; i < this.uploadFiles?.length; i++) {
    //   imgFolder.file(this.uploadFiles[i].name, this.uploadFiles[i], { base64: true });
    // }
    let count = 0;
    const ref = this.storage.ref('json/');
    let myurlsubscription = ref.listAll().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        let name = data.items[i].name;
        console.log('Nom du fichier :: :: --> ',name)
        // console.log(this.exercicesAdded)
        // this.exercicesAdded.forEach((element:any) => {
        //   console.log(element.id_exercice)
        //   if(name === element.id_exercice){
        //     let newref = this.storage.ref( 'json/'+data.items[i].name);
        //     // console.log('LE NOM DE CE FILE ::: ::',name)
        //     let url = newref.getDownloadURL().subscribe((data) => {
        //     console.log('NOS DATA',data)
        //       // zip.file(name , exFolder, {binary: true});
        //       // console.log(data.items.length)
        //     this.httpClient.get(data, {responseType: 'blob'}).subscribe(response => {
        //     console.log('RESPONSE  ::: !! ',response);
        //       // // + file.extension
        //     zip.file('exercise/'+name+'.json' , response, {binary: true});
        //     count++;
        //       if (count === this.exercicesAdded.length) {
        //           setTimeout(() => {
        //             if( this.jsonDesc.exercises.length === this.exercicesAdded.length){
        //               console.log('Le json a inject: ::',this.jsonDesc)
        //               zip.file('description.json' , new TextEncoder().encode(JSON.stringify(this.jsonDesc)), {binary: true});
        //               zip.generateAsync({type: 'blob'}).then(content => {
        //                 FileSaver.saveAs(content,  'data.zip');
        //               });
        //             }
        //           }, 200);
        //         }
        //       });
        //      });
        //   }
        //  });

      }
    });
  }

  // const zip = new JSZip();

  // zip.file("Hello.txt", "Hello World\n");
  
  // const img = zip.folder("images");
  // img.file("smile.gif", imgData, {base64: true});
  
  // zip.generateAsync({type:"blob"}).then(function(content) {
  //     // see FileSaver.js
  //     saveAs(content, "example.zip");
  // });
  


}