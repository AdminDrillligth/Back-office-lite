import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class FireStoreServiceExercice {
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
  id_club:any;

  constructor(private router:Router,private datePipe: DatePipe, private db: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.user.email
    this.getexerciseOfUserClubWithIdClub();
    // this.db.collection("club-infos", ref => ref.where('email', '==', this.user))
  }

  addExercice() {
    localStorage.removeItem('idex');
    let type:any;
    if(this.router.url.includes('/club/')){
      type = 'club';
    }
    if(this.router.url.includes('/staff/')){
      type = 'staff';
    }
    if(this.router.url.includes('/admin/')){
      type = 'admin';
    }
    console.log(type, this.datePipe.transform(this.maDate, 'dd/MM/yyyy'));
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise').add({ type:type, usermail: this.user , date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
          (r: any) => {
            localStorage.setItem('idex', JSON.stringify(r.id));
            this.idexo = JSON.parse(localStorage.getItem('idex') || '{}');
            console.log(this.idexo);
            this.addInfosExercice(this.idexo,type)
          },
          (err: any) => reject(err)
        );
    });
  }

  addInfosExercice(idOfExercice: any, type:any) {
    console.log('NEW ID TO PUSH',idOfExercice)
    return new Promise<any>((resolve, reject) => {
      console.log('NEW ID TO PUSH',idOfExercice)
      this.db.collection('exercise-infos').add({type:type,  usermail: this.user, id_exercice: idOfExercice, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'), dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
          (r: any) => {
            localStorage.setItem('id-ex-inf', JSON.stringify(r.id));
            this.idInfos = JSON.parse(localStorage.getItem('id-ex-inf') || '{}');
            console.log(this.idInfos);
            this.addPropertysExercises(this.idInfos, type);
          },
          (err: any) => reject(err)
        );
    });
  }

  addPropertysExercises(idInfo: any,type:any){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-propertys').add({ type:type,usermail: this.user,id_exercice: this.idexo, id_infos: this.idInfos, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-ex-property', JSON.stringify(r.id));
            this.idProps = JSON.parse(localStorage.getItem('id-ex-property') || '{}');
            // console.log(this.idProps);
            this.addSpecificationExercises(this.idProps, type);
          },
          (err: any) => reject(err)
        );
    });
  }

  addSpecificationExercises(idProp: any,type:any){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-specification').add({ type:type, usermail: this.user,id_exercice: this.idexo, id_infos: this.idInfos,id_property: this.idProps, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-ex-specs', JSON.stringify(r.id));
            this.idSpecs = JSON.parse(localStorage.getItem('id-ex-specs') || '{}');
            this.addBlanketExercise(this.idProps, type);
          },
          (err: any) => reject(err)
        );
    });
  }

  addBlanketExercise(idProp: any,type:any){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-blanket').add({type:type, usermail: this.user,id_exercice: this.idexo, id_specification: this.idSpecs,id_infos: this.idInfos,id_property: this.idProps, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-ex-blanket', JSON.stringify(r.id));
            this.idBlanket = JSON.parse(localStorage.getItem('id-ex-blanket') || '{}');
            this.addPodsSettingsExercises(this.idBlanket, type);
          },
          (err: any) => reject(err)
        );
    });
  }

  addPodsSettingsExercises(idProp: any, type:any){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-pods-settings').add({ type:type,usermail: this.user,id_exercice: this.idexo,id_blanket:this.idBlanket,id_specification: this.idSpecs, id_infos: this.idInfos,id_property: this.idProps, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-ex-pods-settings', JSON.stringify(r.id));
            this.idPodsSettings = JSON.parse(localStorage.getItem('id-ex-pods-settings') || '{}');
            this.addStepsSettingsExercises(this.idProps,type);
            // console.log(this.idPodsSettings);
          },
          (err: any) => reject(err)
        );
    });
  }

  addStepsSettingsExercises(idProp: any, type:any){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-steps-settings').add({type:type, usermail: this.user,id_pods_settings:this.idPodsSettings ,id_blanket:this.idBlanket, id_exercice: this.idexo,id_specification: this.idSpecs, id_infos: this.idInfos,id_property: this.idProps, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS') }).then(
          (r: any) => {
            localStorage.setItem('id-ex-steps-settings', JSON.stringify(r.id));
            this.idStepsSettings = JSON.parse(localStorage.getItem('id-ex-steps-settings') || '{}');
            // console.log(this.idStepsSettings);
          },
          (err: any) => reject(err)
        );
    });
  }

  updateInfoExercice(idOfExercice: any, data:any) {
    // console.log('onupdatelesinfos', idOfExercice)
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-infos').doc(idOfExercice).update(data).then(
          (res: any) => {
            // console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  updateInfoExerciceWithIdex(id: any,data:any){
    let idInfo:any
    // console.log('On update with this id',id)
    this.db.collection("exercise-infos", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idInfo = e.id;
        // console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('exercise-infos').doc(idInfo).update(data)
          this.db.collection('exercise-infos').doc(idInfo).update({modified: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')})
        }, 200);}
    })
    )
   }

  updatePropertyExercice(idOfExercice: any, data:any) {
    // console.log('On intégre avec cet id: ',idOfExercice)

    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-propertys').doc(idOfExercice).update(data).then(
          (res: any) => {
            // console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  updatePropertyExerciceWithIdex(id: any, data:any){
    let idProp:any
    this.db.collection("exercise-propertys", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idProp = e.id;
        // console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('exercise-propertys').doc(idProp).update(data)
        }, 200);}
    })
    )
   }

  updateSpecificationExercice(idOfExercice: any, data:any) {
    // console.log('On intégre avec cet id: ',idOfExercice)

    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-specification').doc(idOfExercice).update(data).then(
          (res: any) => {
            // console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  updateSpecificationExerciceWithIdex(id: any, data:any){
    let idProp:any
    this.db.collection("exercise-specification", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idProp = e.id;
        // console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('exercise-specification').doc(idProp).update(data)
        }, 200);}
    })
    )
   }

  updateBlanketExercice(idOfExercice: any, data:any) {
     console.log('On intégre avec cet id: ',idOfExercice)

    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-blanket').doc(idOfExercice).update(data).then(
          (res: any) => {
             console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }


  updateBlanketExerciceWithIdex(id: any, data:any){
    let idProp:any
    console.log('ok on va get this id ex', id, data)
    this.db.collection("exercise-blanket", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idProp = e.id;
        console.log('on test:  ',e.id)
        this.updateBlanketExercice(idProp,data);
        // this.db.collection('exercise-blanket').doc(idProp).update(data)
      }
    })
    )
   }

  updatePodsSettingsExercice(idOfExercice: any, data:any) {
    // console.log('On intégre avec ces datas: ',idOfExercice, data)

    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-pods-settings').doc(idOfExercice).update(data).then(
          (res: any) => {
            // console.log('pods settings:', res);
          },
          (err: any) => reject(err)
        );
    });
  }


  updatePodsSettingsExerciceWithIdex(id: any, data:any){
    let idProp:any
    this.db.collection("exercise-pods-settings", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idProp = e.id;
        // console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('exercise-pods-settings').doc(idProp).update(data)
        }, 200);}
    })
    )
   }
   
  updateStepsSettingsExercice(idOfExercice: any, data:any) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('exercise-steps-settings').doc(idOfExercice).update(data).then(
          (res: any) => {
            // console.log('ep:', res);
          },
          (err: any) => reject(err)
        );
    });
  }

  updateStepsSettingsExerciceWithIdex(id: any, data:any){
    let idProp:any
    this.db.collection("exercise-steps-settings", ref => ref.where('id_exercice', '==', id)).get().subscribe((arg: any) =>
    arg.forEach((e:any) => {
      if(arg){
        idProp = e.id;
        // console.log('on test:  ',e.id)
        setTimeout(() => {
          this.db.collection('exercise-steps-settings').doc(idProp).update(data)
        }, 200);}
    })
    )
   }

  getInfoExercice(idOfExercice: any) {
    return this.db.collection('exercise-infos').doc(idOfExercice).get();
  }

  getPropertyExercice(idOfPropertyExercice: any) {
    return this.db.collection('exercise-propertys').doc(idOfPropertyExercice).get();
  }

  getSpecificationExercice(idOfPropertyExercice: any) {
    return this.db.collection('exercise-specification').doc(idOfPropertyExercice).get();
  }

  getBlanketExercice(idOfPropertyExercice: any) {
    return this.db.collection('exercise-blanket').doc(idOfPropertyExercice).get();
  }

  getPodsSettingsExercice(idOfPropertyExercice: any) {
    return this.db.collection('exercise-pods-settings').doc(idOfPropertyExercice).get();
  }

  getStepsSettingsExercice(idOfPropertyExercice: any) {
    return this.db.collection('exercise-steps-settings').doc(idOfPropertyExercice).get();
  }

  getexerciseOfUser(){
    console.log('le user', this.user)
   return this.db.collection("exercise", ref => ref.where('usermail', '==', this.user)).get()
  }

  getexerciseOfUserAdmin(user:string){
    return this.db.collection("exercise", ref => ref.where('usermail', '==', user)).get()
   }

  getexerciseOfUserClubWithIdClub(){
    return this.db.collection("club-infos", ref => ref.where('email', '==', this.user))
  }

  getexerciseOfUserWithIdClub_2(idclub:any){
    return this.db.collection("exercise-infos", ref => ref.where('id_club', '==', idclub)).get()
  }

  getexerciseOfUserStaffWithIdClub(){
    // console.log('LE USER : ',this.user,this.db.collection("club-infos", ref => ref.where('email', '==', this.user)).get())
    // return    this.db.collection("exercise", ref => ref.where('id_club', '==', this.id_club)).get()
    this.db.collection("staff-infos", ref => ref.where('email', '==', this.user)).get().subscribe((arg: any) => {
      console.log('LE USER 2: ',arg)
      arg.forEach((element:any) => {
        console.log('LE DETAIl :',element.data())
      });
    })
  }

  getexerciseOfUserPlayerWithIdClub(){
    // console.log('LE USER : ',this.user,this.db.collection("club-infos", ref => ref.where('email', '==', this.user)).get())
    // return    this.db.collection("exercise", ref => ref.where('id_club', '==', this.id_club)).get()
    this.db.collection("player-infos", ref => ref.where('email', '==', this.user)).get().subscribe((arg: any) => {
      console.log('LE USER 2: ',arg)
      arg.forEach((element:any) => {
        console.log('LE DETAIl :',element.data())
      });
    })
  }

  getexerciseInfoOfUserAndId(id: any){
    return  this.db.collection("exercise-infos", ref => ref.where('id_exercice', '==', id)).get()
   }

   getexercisepropertyOfUserAndId(id: any){
    return  this.db.collection("exercise-propertys", ref => ref.where('id_exercice', '==', id)).get()
   }

   getexerciseSpecificationOfUserAndId(id: any){
    return  this.db.collection("exercise-specification", ref => ref.where('id_exercice', '==', id)).get()
   }

   getexerciseBlanketOfUserAndId(id: any){
    return  this.db.collection("exercise-blanket", ref => ref.where('id_exercice', '==', id)).get()
   }

   getexercisePodsSettingsOfUserAndId(id: any){
    return  this.db.collection("exercise-pods-settings", ref => ref.where('id_exercice', '==', id)).get()
   }

   getexerciseStepsSettingsOfUserAndId(id: any){
    return  this.db.collection("exercise-steps-settings", ref => ref.where('id_exercice', '==', id)).get()
   }

  deleteExercice(id:any) {
    console.log('L\'id de l\'exo a suppr:: :::',id)
    this.db.collection('exercise').doc(id).delete()
  }
}

function reject(err: any): any {
  throw new Error('Function not implemented.');
}

