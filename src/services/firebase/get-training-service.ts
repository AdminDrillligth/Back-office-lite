import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FireStoreServiceExercice } from '../firebase/firestore-exercices.service';

@Injectable({ providedIn: 'root' })
export class trainingService {
  exercices!: AngularFirestoreCollection<any>;
  maDate = new Date();
  user:any;
  id_club:any;
  cardFireStore:any =[];
  cardInfoStore:any =[];
  cardPropertyStore:any=[];
  cardSpecificationStore:any=[];
  cardBlanketStore:any=[];
  cardPodsSetting:any=[];
  cardStepSetting:any=[];
  currentList: any;
  recentTrainings :any = { type: 'recent', cards: [] }
  categorys = ['Pré-formation', 'Formation', 'Seniors'];
  categoryOneTrainings :any = { type: 'Pré-formation', cards: [] }
  categoryTwoTrainings :any= { type: 'Formation', cards: [] }
  categoryTreeTrainings :any = { type: 'Seniors', cards: [] };
  highlightedsExercices: any = { type: 'highlighted', cards: [] };


  constructor(
    private firestore:FireStoreServiceExercice ){
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getTrainings(){
    this.cardFireStore.length = 0; this.cardInfoStore.length = 0;this.cardPropertyStore.length = 0;
    this.cardSpecificationStore.length = 0;this.cardBlanketStore.length = 0;
    this.cardPodsSetting.length = 0;this.cardStepSetting.length = 0;
    return new Promise<any>((resolve, reject) => {
      this.firestore.getexerciseOfUser().subscribe((docSnap: any) => {
        this.cardFireStore.length =0;
            docSnap.forEach((e:any) => {
            console.log('LES DATAS DES EXOS DE L\'USER',e.data())
            console.log(e.id)
            let array = {id:e.id,data:e.data()}
            this.cardFireStore.push(array);
        });
         for (let index = 0; index < this.cardFireStore.length; index++) {
            const element = this.cardFireStore[index];
            setTimeout(() => {
              this.firestore.getexerciseInfoOfUserAndId(element.id).subscribe((docSnap: any) => {
                docSnap.forEach((e:any) => {
                  let array = {id:e.id,data:e.data()}
                  this.cardInfoStore.push(array);
                });
               });
               this.firestore.getexercisepropertyOfUserAndId(element.id).subscribe((docSnap: any) => {
                docSnap.forEach((e:any) => {
                  let array = {id:e.id,data:e.data()}
                  this.cardPropertyStore.push(array);
                });
              });
               this.firestore.getexerciseSpecificationOfUserAndId(element.id).subscribe((docSnap: any) => {
                docSnap.forEach((e:any) => {
                  let array = {id:e.id,data:e.data()}
                  this.cardSpecificationStore.push(array);
                });
              });
              this.firestore.getexerciseBlanketOfUserAndId(element.id).subscribe((docSnap: any) => {
                docSnap.forEach((e:any) => {
                  let array = {id:e.id,data:e.data()}
                  this.cardBlanketStore.push(array);
                });
              });
              this.firestore.getexercisePodsSettingsOfUserAndId(element.id).subscribe((docSnap: any) => {
                docSnap.forEach((e:any) => {
                  let array = {id:e.id,data:e.data()}
                  this.cardPodsSetting.push(array);
                });
              });
              this.firestore.getexerciseStepsSettingsOfUserAndId(element.id).subscribe((docSnap: any) => {
               docSnap.forEach((e:any) => {
                 let array = {id:e.id,data:e.data()}
                 this.cardStepSetting.push(array);
               });
             });
            }, 150);
          }
          setTimeout(() => {
            let data = [this.cardFireStore, this.cardInfoStore, this.cardPropertyStore, this.cardSpecificationStore,this.cardBlanketStore, this.cardStepSetting, this.cardPodsSetting]
            resolve(data);
           }, 200);
      });
    });
  }

  getinject(){
    return new Promise<any>((resolve, reject) => {
      this.recentTrainings.cards.length =0; this.categoryOneTrainings.cards.length =0;
      this.categoryTwoTrainings.cards.length =0; this.categoryTreeTrainings.cards.length =0;
      this.highlightedsExercices.cards.length = 0;
      let preforma = 0; let forma = 0; let senio = 0; let shortname:'';
      setTimeout(() => {
        for (let index = 0; index < this.cardFireStore.length; index++) {
          const element = this.cardFireStore[index];
          if(this.cardInfoStore[index] !== undefined){
            if(this.cardInfoStore[index].data !== undefined){
              if(this.cardInfoStore[index].data.title !== undefined){ let accents = this.cardInfoStore[index].data.title;
                accents = accents.replace(/\s+/g, '');  let sans_accents = accents.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                sans_accents = sans_accents.toLowerCase(); shortname = sans_accents;
              }
            }
          }
          if(this.cardInfoStore[index] === undefined || this.cardSpecificationStore[index] === undefined){
            setTimeout(() => {
              this.recentTrainings.cards.length =0;
              this.categoryOneTrainings.cards.length =0;
              this.categoryTwoTrainings.cards.length =0;
              this.categoryTreeTrainings.cards.length =0;
              this.highlightedsExercices.cards.length = 0;
              // Décommentaire possible important
              // this.getInfoGLobal();
            }, 1300);
            break;
          }
          else{
            this.cardSpecificationStore.forEach((element: { data: { mode: any; }; }) => {
            });
            let url;
            if(this.cardBlanketStore[index].data.url !== undefined){
              url = this.cardBlanketStore[index].data.url;
            }else{
              url ='assets/images/unsplash_IEwZRIVwoCs.png';
            }
            this.recentTrainings.cards.push({name:'',mode:this.cardSpecificationStore[index].data.mode,date:Date, id:element.id, image:url,state:this.cardInfoStore[index].data.levels,time:'',shortname:shortname,text:this.cardInfoStore[index].data.title,audience:'Private',
            highlighted:false,create_date:this.cardInfoStore[index].data.date,age_category:this.cardInfoStore[index].data.age_category,categorie:[],thematic:[],sports:[],description:this.cardInfoStore[index].data.description});
            if(this.cardInfoStore[index].data !==  undefined){
              if(this.cardInfoStore[index].data.categorys !== undefined){
                if(Array.isArray(this.cardInfoStore[index].data.categorys) === false){
                  this.recentTrainings.cards[index].categorie.push(this.cardInfoStore[index].data.categorys)
                }if(Array.isArray(this.cardInfoStore[index].data.categorys) === true){
                  let catego = this.cardInfoStore[index].data.categorys
                  if(catego.length !== undefined){
                    for (let inder = 0; inder < catego.length; inder++) { const cat = catego[inder]; this.recentTrainings.cards[index].categorie.push(cat.name);}
                  }
                }
              }
            }
            if( this.cardSpecificationStore[index].data.mode === 'mode1'){
              this.recentTrainings.cards[index].time = Math.round(this.cardSpecificationStore[index].data.time/60).toString()
            }
            if( this.cardSpecificationStore[index].data.mode === 'mode2' || this.cardSpecificationStore[index].data.mode === 'Boucle'){
              this.recentTrainings.cards[index].time = this.cardSpecificationStore[index].data.time.toString()
            }

            if(this.cardInfoStore[index].data.highlighted !== undefined){
              this.recentTrainings.cards[index].highlighted = this.cardInfoStore[index].data.highlighted;
            }
            if(this.cardPropertyStore[index].data.status === 'status2'){
              // this.recentTrainings.cards[index].audience = this.trainingAudiences.PUBLIC
            }else{
              // this.recentTrainings.cards[index].audience = this.trainingAudiences.PRIVATE
            }
            if(this.cardSpecificationStore[index].data.sports !== undefined){
              this.cardSpecificationStore[index].data.sports.forEach((element: any) => {
                this.recentTrainings.cards[index].sports.push(element.name);
              });
            }
            if(this.cardInfoStore[index].data.thematics !== undefined){
              if(this.cardInfoStore[index].data.thematics.length){
              this.cardInfoStore[index].data.thematics.forEach((element: any) => {
                this.recentTrainings.cards[index].thematic.push(element.name);
              });
              }
              if(this.cardInfoStore[index].data.highlighted !== undefined){
                if(this.cardInfoStore[index].data.highlighted === true){
                  this.highlightedsExercices.cards.push(this.recentTrainings.cards[index]);
                }
              }
            }
            setTimeout(() => {
              let url:string;
              if(this.cardBlanketStore[index].data.url !== undefined){
                url = this.cardBlanketStore[index].data.url;
              }else{
                url ='assets/images/unsplash_IEwZRIVwoCs.png';
              }
              if( this.recentTrainings.cards[index] !== undefined && this.recentTrainings.cards[index].categorie !== undefined){
                this.recentTrainings.cards[index].categorie.forEach((e:any) => {
                      if(e === 'Pré-formation'){
                        preforma = preforma+1;
                        let newdate = (this.cardInfoStore[index].data.date).toString();
                        this.categoryOneTrainings.cards.push({mode:this.cardSpecificationStore[index].data.mode,id:element.id, image:url,state:this.cardInfoStore[index].data.levels,time:this.cardSpecificationStore[index].data.time,text:this.cardInfoStore[index].data.title,shortname:this.recentTrainings.cards[index].shortname,audience:'Private',
                        highlighted:false, create_date:newdate,age_category:this.cardInfoStore[index].data.age_category,categorie:[],thematic:[],sports:[],description:this.cardInfoStore[index].data.description})
                        if(this.cardInfoStore[index].data.highlighted !== undefined){
                          this.categoryOneTrainings.cards[preforma-1].highlighted = this.cardInfoStore[index].data.highlighted;
                        }
                          this.categoryOneTrainings.cards[preforma-1].audience = this.recentTrainings.cards[index].audience
                          this.categoryOneTrainings.cards[preforma-1].sports = this.recentTrainings.cards[index].sports
                          this.categoryOneTrainings.cards[preforma-1].categorie = this.recentTrainings.cards[index].categorie
                          this.categoryOneTrainings.cards[preforma-1].thematic =this.recentTrainings.cards[index].thematic
                      }
                      if(e === 'Formation'){
                        forma = forma+1;
                        let newdate = (this.cardInfoStore[index].data.date).toString();
                        this.categoryTwoTrainings.cards.push({mode:this.cardSpecificationStore[index].data.mode,id:element.id, image:url,state:this.cardInfoStore[index].data.levels,time:this.cardSpecificationStore[index].data.time,shortname:this.recentTrainings.cards[index].shortname,text:this.cardInfoStore[index].data.title,audience:'Private',
                        highlighted:false,create_date:newdate,age_category:this.cardInfoStore[index].data.age_category, categorie:[],thematic:[],sports:[],description:this.cardInfoStore[index].data.description})
                        if(this.cardInfoStore[index].data.highlighted !== undefined){
                          this.categoryTwoTrainings.cards[forma-1].highlighted = this.cardInfoStore[index].data.highlighted;
                        }
                        this.categoryTwoTrainings.cards[forma-1].audience = this.recentTrainings.cards[index].audience
                        this.categoryTwoTrainings.cards[forma-1].sports = this.recentTrainings.cards[index].sports
                        this.categoryTwoTrainings.cards[forma-1].categorie = this.recentTrainings.cards[index].categorie
                        this.categoryTwoTrainings.cards[forma-1].thematic =this.recentTrainings.cards[index].thematic
                      }
                      if(e === 'Séniors' || e === 'Seniors'){
                        senio = senio+1;
                        let newdate = (this.cardInfoStore[index].data.date).toString();
                        this.categoryTreeTrainings.cards.push({mode:this.cardSpecificationStore[index].data.mode,id:element.id, image:url,state:this.cardInfoStore[index].data.levels,time:this.cardSpecificationStore[index].data.time,shortname:this.recentTrainings.cards[index].shortname,text:this.cardInfoStore[index].data.title,audience:'Private',
                        highlighted:false,create_date:newdate,age_category:this.cardInfoStore[index].data.age_category,categorie:[],thematic:[],sports:[],description:this.cardInfoStore[index].data.description})
                        if(this.cardInfoStore[index].data.highlighted !== undefined){
                          this.categoryTreeTrainings.cards[senio-1].highlighted = this.cardInfoStore[index].data.highlighted;
                        }
                        this.categoryTreeTrainings.cards[senio-1].audience = this.recentTrainings.cards[index].audience
                        this.categoryTreeTrainings.cards[senio-1].sports = this.recentTrainings.cards[index].sports
                        this.categoryTreeTrainings.cards[senio-1].categorie = this.recentTrainings.cards[index].categorie
                        this.categoryTreeTrainings.cards[senio-1].thematic =this.recentTrainings.cards[index].thematic
                      }
                });
                this.recentTrainings.cards.sort((a:any, b:any) => -a.create_date.localeCompare(b.create_date))
                this.categoryOneTrainings.cards.sort((one:any, two:any) => (one.text > two.text ? 1 : -1));
                this.categoryTwoTrainings.cards.sort((one:any, two:any) => (one.text > two.text ? 1 : -1));
                this.categoryTreeTrainings.cards.sort((one:any, two:any) => (one.text > two.text ? 1 : -1));
                let data = [  this.recentTrainings,this.categoryOneTrainings,this.categoryTwoTrainings,this.categoryTreeTrainings,this.highlightedsExercices]
                resolve(data);
              }
             }, 400);}
          }
        }, 800);
    })
  }

  query: any = { title: '', date: { startDate: '', endDate: ''}, tagsAgeCat: [], levelsArray: [] };
  startDate: any;
  endDate: any;
  selectedTag: any;
  selectedTags: any;
  selectedLevel:any;
  selectedLevels:any;
  passHight= false;
  passBoleanLengthCatAge = false;
  passBoleanLengthSelect = false;
  inputSearchValue: any;
  tagsAgeCat =  [{id:0, name:'U7'},{id:1, name:'U9'},{id:2, name:'U11'},{id:3, name:'U13'},{id:4, name:'U15'}, {id:5, name:'U17'},{id:6, name:'U18'},{id:7, name:'U19'},{id:8, name:'Seniors'}];
  levelsArray = [{id:0, name:'Facile'},{id:1, name:'Intermediaire'} ,{id:2, name:'Difficile'} ];

  getSelectedAgeTag(items:any){
    return new Promise<any>((resolve, reject) => {
    this.selectedTags = items;
    this.query = { date: { startDate: this.startDate ? this.startDate : '', endDate: this.endDate ? this.endDate : ''},
      title: this.inputSearchValue ? this.inputSearchValue : '',levelsArray:this.selectedLevels  ? this.selectedLevels : [], tagsAgeCat: this.selectedTags ? this.selectedTags : [],
    };
    if(this.query.levelsArray.length !== 0 && this.query.tagsAgeCat.length === 0){
      // this.getSelectedLevel(this.query.selectedTags)
    }
   // this.getInfoGLobal();
   console.log('Notre query :: !',this.query)
    setTimeout(() => {
        let recent:any[] = []; let recentBolean = false;
        let one:any[] = []; let oneBolean = false;
        let two:any[] = []; let twoBolean = false;
        let tree:any[] = []; let treeBolean = false;
        let favorite:any[] = []; let favoriteBolean = false;
        this.query.tagsAgeCat.forEach((element:any) => {
            this.recentTrainings.cards.forEach((item: any, i:number)=>{ item.age_category.forEach((elem:any) => {
                    if(elem.name === element.name){ recentBolean = true; recent.push(this.recentTrainings.cards[i])}
                 });
            });
            this.categoryOneTrainings.cards.forEach((item: any, i:number)=>{ item.age_category.forEach((elem1:any) => {
                 if(elem1.name === element.name){ oneBolean = true; one.push(this.categoryOneTrainings.cards[i])}
              });
            });
            this.categoryTwoTrainings.cards.forEach((item: any, i:number)=>{ item.age_category.forEach((elem2:any) => {
                if(elem2.name === element.name){ twoBolean = true; two.push(this.categoryTwoTrainings.cards[i])}
              });
            });
            this.categoryTreeTrainings.cards.forEach((item: any, i:number)=>{ item.age_category.forEach((elem3:any) => {
                if(elem3.name === element.name){ treeBolean = true; tree.push(this.categoryTreeTrainings.cards[i])}
              });
            });
            this.highlightedsExercices.cards.forEach((item: any, i:number)=>{ item.age_category.forEach((elem4:any) => {
                if(elem4.name === element.name){ favoriteBolean = true; favorite.push(this.highlightedsExercices.cards[i])}
              });
            });
        });
        recent = Object.values(recent.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        one = Object.values(one.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        two = Object.values(two.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        tree = Object.values(tree.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        favorite = Object.values(favorite.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        if(this.query.tagsAgeCat.length !== 0){
        if(recent.length !== 0 || recentBolean ){ this.recentTrainings.cards = recent; }else{ this.recentTrainings.cards = [] }
        if(one.length !== 0 || oneBolean){ this.categoryOneTrainings.cards = one; }else{ this.categoryOneTrainings.cards = [] }
        if(two.length !== 0 || twoBolean ){ this.categoryTwoTrainings.cards = two; }else{ this.categoryTwoTrainings.cards = [] }
        if(tree.length !== 0 || treeBolean){ this.categoryTreeTrainings.cards = tree; }else{ this.categoryTreeTrainings.cards = [] }
        if(favorite.length !== 0 || favoriteBolean ){ this.highlightedsExercices.cards = favorite; }else{ this.highlightedsExercices.cards = [] }
        if(this.query.levelsArray.length !== 0){
          // recentBolean = false; oneBolean = false; twoBolean=false; treeBolean = false; favoriteBolean = false;
          // recent.length = 0;one.length=0;two.length=0;tree.length=0;favorite.length=0;
          // this.passBoleanLengthSelect = true;
          // this.getSelectedLevel(this.query.levelsArray);
          this.query.levelsArray.forEach((element:any) => {
            // Si un élément est identique à celui recherché dans ce cas on rempli le tableau
            this.recentTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){recentBolean = true; recent.push(this.recentTrainings.cards[i])}});
            this.categoryOneTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ oneBolean = true; one.push(this.categoryOneTrainings.cards[i])}});
            this.categoryTwoTrainings.cards.forEach((item: any, i:number)=>{  if(item.state === element.name){ twoBolean = true; two.push(this.categoryTwoTrainings.cards[i])}});
            this.categoryTreeTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ treeBolean = true; tree.push(this.categoryTreeTrainings.cards[i])}});
            this.highlightedsExercices.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ favoriteBolean = true; favorite.push(this.highlightedsExercices.cards[i])}});
        });
        // On supprime les doublons de chaque tableau
        recent = Object.values(recent.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        one = Object.values(one.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        two = Object.values(two.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        tree = Object.values(tree.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        favorite = Object.values(favorite.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        if(this.query.levelsArray.length !== 0){
          // Puis on vérifie si il est nécessaire de les insérer dans les objets principaux
          if(recent.length !== 0 || recentBolean ){ this.recentTrainings.cards = recent; }else{ this.recentTrainings.cards = [] }
          if(one.length !== 0 || oneBolean){ this.categoryOneTrainings.cards = one; }else{ this.categoryOneTrainings.cards = [] }
          if(two.length !== 0 || twoBolean ){ this.categoryTwoTrainings.cards = two; }else{ this.categoryTwoTrainings.cards = [] }
          if(tree.length !== 0 || treeBolean){ this.categoryTreeTrainings.cards = tree; }else{ this.categoryTreeTrainings.cards = [] }
          if(favorite.length !== 0 || favoriteBolean ){ this.highlightedsExercices.cards = favorite; }else{ this.highlightedsExercices.cards = [] }

        }
        if(this.query.levelsArray.length === 0){
          console.log('Notre niveau Level :: ',this.query.levelsArray)
           this.passBoleanLengthSelect = false;
        }
      }
    }
    let data = [this.recentTrainings,this.categoryOneTrainings,this.categoryTwoTrainings,this.categoryTreeTrainings,this.highlightedsExercices]
    resolve(data);
    }, 1400);
    });
  }

  getSelectedLevels(items:any){
    return new Promise<any>((resolve, reject) => {
    this.selectedLevels = items;
    // On enrichi notre Objet QUERY, avec les différents levels séléctionnés
    this.query = {
      date: { startDate: this.startDate ? this.startDate : '', endDate: this.endDate ? this.endDate : ''},
      title: this.inputSearchValue ? this.inputSearchValue : '',tagsAgeCat: this.selectedTags ? this.selectedTags : [], levelsArray:this.selectedLevels  ? this.selectedLevels : []
    };
    if(this.query.tagsAgeCat.length !== 0 && this.query.levelsArray.length === 0){
      //this.getSelectedCatAge(this.query.tagsAgeCat)
    }
    // On vérifie si c'est un passage lié à la requête des catégories d'âges
    // Si non on réïtère la boucle de remplissage des datas des tableaux
   // this.getInfoGLobal();
      setTimeout(() => {
        // On initialise les différents Tableaux afin de driver le passage des conditions de l'algoryhme de filtre des niveaux
        let recent:any[] = []; let recentBolean = false;
        let one:any[] = []; let oneBolean = false;
        let two:any[] = []; let twoBolean = false;
        let tree:any[] = []; let treeBolean = false;
        let favorite:any[] = []; let favoriteBolean = false;
        // On parcourt le tableau des niveaux afin de générer un tableau périodique, pour chaque catégorie
        this.query.levelsArray.forEach((element:any) => {
            // Si un élément est identique à celui recherché dans ce cas on rempli le tableau
            this.recentTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ recentBolean = true; recent.push(this.recentTrainings.cards[i])}});
            this.categoryOneTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ oneBolean = true; one.push(this.categoryOneTrainings.cards[i])}});
            this.categoryTwoTrainings.cards.forEach((item: any, i:number)=>{  if(item.state === element.name){ twoBolean = true; two.push(this.categoryTwoTrainings.cards[i])}});
            this.categoryTreeTrainings.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ treeBolean = true; tree.push(this.categoryTreeTrainings.cards[i])}});
            this.highlightedsExercices.cards.forEach((item: any, i:number)=>{ if(item.state === element.name){ favoriteBolean = true; favorite.push(this.highlightedsExercices.cards[i])}});
        });
        // On supprime les doublons de chaque tableau
        recent = Object.values(recent.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        one = Object.values(one.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        two = Object.values(two.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        tree = Object.values(tree.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        favorite = Object.values(favorite.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        if(this.query.levelsArray.length !== 0){
          // Puis on vérifie si il est nécessaire de les insérer dans les objets principaux
        if(recent.length !== 0 || recentBolean ){ this.recentTrainings.cards = recent; }else{ this.recentTrainings.cards = [] }
        if(one.length !== 0 || oneBolean){ this.categoryOneTrainings.cards = one; }else{ this.categoryOneTrainings.cards = [] }
        if(two.length !== 0 || twoBolean ){ this.categoryTwoTrainings.cards = two; }else{ this.categoryTwoTrainings.cards = [] }
        if(tree.length !== 0 || treeBolean){ this.categoryTreeTrainings.cards = tree; }else{ this.categoryTreeTrainings.cards = [] }
        if(favorite.length !== 0 || favoriteBolean ){ this.highlightedsExercices.cards = favorite; }else{ this.highlightedsExercices.cards = [] }
        if(this.query.tagsAgeCat.length !== 0){
          recentBolean=false;oneBolean=false;twoBolean=false;treeBolean=false;favoriteBolean=false;
          let recent2:any = []; let one2:any = []; let two2:any = []; let tree2:any = [];let favorite2:any = [];
          this.query.tagsAgeCat.forEach((element:any) => {
            // Si un élément est identique à celui recherché dans ce cas on rempli le tableau
            recent.forEach((item: any, i:number)=>{
              item.age_category.forEach((elem:any) => {
              if(elem.name === element.name){ recentBolean = true; recent2.push(recent[i])}
              });
            });
            one.forEach((item: any, i:number)=>{ item.age_category.forEach((elem1:any) => {
              if(elem1.name === element.name){ oneBolean = true; one2.push(one[i])}
              });
            });
            two.forEach((item: any, i:number)=>{ item.age_category.forEach((elem2:any) => {
              if(elem2.name === element.name){ twoBolean = true; two2.push(two[i])}
              });
            });
            tree.forEach((item: any, i:number)=>{ item.age_category.forEach((elem3:any) => {
              if(elem3.name === element.name){ treeBolean = true; tree2.push(tree[i])}
              });
            });
            favorite.forEach((item: any, i:number)=>{ item.age_category.forEach((elem4:any) => {
              if(elem4.name === element.name){ favoriteBolean = true; favorite2.push(favorite[i])}
              });
            });
        });
        // On supprime les doublons de chaque tableau
        recent2 = Object.values(recent2.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        one2 = Object.values(one2.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        two2 = Object.values(two2.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        tree2 = Object.values(tree2.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        favorite2 = Object.values(favorite2.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.id]:cur}),{}))
        if(this.query.tagsAgeCat.length !== 0){
        //  console.log(recent, one, two,tree,favorite)
          // Puis on vérifie si il est nécessaire de les insérer dans les objets principaux
          if(recent2.length !== 0 || recentBolean ){ this.recentTrainings.cards = recent2; }else{ this.recentTrainings.cards = [] }
          if(one2.length !== 0 || oneBolean){ this.categoryOneTrainings.cards = one2; }else{ this.categoryOneTrainings.cards = [] }
          if(two2.length !== 0 || twoBolean ){ this.categoryTwoTrainings.cards = two2; }else{ this.categoryTwoTrainings.cards = [] }
          if(tree2.length !== 0 || treeBolean){ this.categoryTreeTrainings.cards = tree2; }else{ this.categoryTreeTrainings.cards = [] }
          if(favorite2.length !== 0 || favoriteBolean ){ this.highlightedsExercices.cards = favorite2; }else{ this.highlightedsExercices.cards = [] }
        }
        if(this.query.tagsAgeCat.length === 0){
          console.log('CAT AGE LENGTH ::: ', this.query.tagsAgeCat)
          this.passBoleanLengthCatAge = false;
        }
        }
      }
      let data = [this.recentTrainings,this.categoryOneTrainings,this.categoryTwoTrainings,this.categoryTreeTrainings,this.highlightedsExercices]
      resolve(data);
        // Ensuite on inspecte le tableau des catégories d'âges, afin de savoir si l'on passe ou non dans la fonction adéquat
    }, 1400);

  });
  }

}
