import {  Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { trainingService } from '../../services/firebase/get-training-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise-handler.service';
import { MatRadioModule } from '@angular/material/radio';
import ImageResize from 'image-resize';
import { uid } from 'uid';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})



export class TrainingsComponent implements OnInit {
  searchText = '';
  categorie = new FormControl('');
  level = new FormControl('');
  theme = new FormControl('');
  categorieslist = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'SENIOR'];
  itemsNav = [
    // {type:'Exercices', value:'Exercices', selected:true},
    // {type:'Séances', value:'Sessions', selected:false},
    // {type:'Programmes', value:'Programmes', selected:false},
  ];

  levelsArray = [{id:0, name:'Facile'},{id:1, name:'Intermediaire'} ,{id:2, name:'Difficile'} ];

  thematics = [{ name: 'Tactique',id:0}, { name: 'Technique',id:1 }, { name: 'Physique', id:2 }, { name: 'Échauffement', id:3 },{ name: 'Finition', id:4 },
    { name: 'Prise d\'information', id:5 }, { name: 'Passe', id:6 }, { name: 'Frappe', id:7 }, { name: 'Dribble', id:8 }, { name: 'Jongle', id:9 },
    { name: 'Conduite de balle', id:10 }, { name: 'Endurance', id:11}, { name: 'Spécifique attaquant', id:12 }, { name: 'Spécifique défenseur', id:13 },
    { name: 'Spécifique milieu', id:14 }, { name: 'Spécifique gardien', id:15 }, { name: 'Autres', id:16 }];

  sports = [{ name: 'Foot', id:0}, { name: 'Rugby',id:1 }, { name: 'Boxe', id:2 }];
  cognitifs = [{ name: 'Sensori moteur',id:0}, { name: 'Perceptivo moteur',id:1 }, { name: 'Motricité fondamentale', id:2 }, { name: 'Motricité spécifique', id:3 }];

  recentTrainings:any = { type: 'recent', cards: []};
  publicTrainings:any = { type: 'public', cards: []};
  privateTrainings:any = { type: 'private', cards: []};
  categoryOneTrainings:any = { type: 'Pré-formation', cards:[]};
  categoryTwoTrainings:any = { type: 'Formation', cards:[]};
  categoryTreeTrainings:any = { type: 'Seniors', cards: []};
  publicSessions:any= { type: 'public', cards: []};
  privateSessions:any= { type: 'private', cards: []};
  chooseType:string='Exercices';
  audience:string='public';
  userSource:any;
  AccountOfUser:any
  idOfOwner:any;
  asAdmin = false;
  disabledSpinner = false;

  constructor(
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    private exerciseService:ExerciseService,
    private router:Router,
    private utilsService: UtilsService,
    // private trainingservice:trainingService,
    public dialog: MatDialog
    ){}
  ngOnInit(): void {
    this.disabledSpinner = true;
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    if(AccountOfUser !== undefined ){
      
      let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
      console.log('ACCOUNT OF USER TRAININGS :! : ', AccountOfUser);
      // console.log('ACCOUNT OF USER TRAININGS NOMBRE D\'EXOS SELECTIONNés:! : ', this.AccountOfUser.trainings);
      this.idOfOwner = AccountOfUser.id;
      
    }
  
    // this.utilsService._templateOptions.subscribe((theme:any) => {
    //   console.log('THEME !: ',theme)
    //  });
     this.utilsService._seeAsAdmin.subscribe((asAdmin:any) => {
      if(asAdmin !== null){
        if(asAdmin === true){
          this.asAdmin = true;
          // if(JSON.parse(localStorage.getItem('account-data-user') || '{}') !== undefined){
            let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
            console.log('LE DETAIL DU USER : ! ',userDetailAccount)
            console.log('LE DETAIL DU USER : ! EXERCICES:! : ', userDetailAccount.trainings);
            this.userSource = userDetailAccount;
            this.getInfoGLobal();
          // }

        }else{
          this.asAdmin = false;
          this.userSource = undefined;
        }
      }
    });
    this.getInfoGLobal();
  }

  getInfoGLobal(){
    
    this.getExercicesList();
    // this.getSessionsList();
  }


  resetSelectedExercices(AccountOfUser:any){
    console.log('LES TRAININGS DU USER : ! ',AccountOfUser.trainings)
    let userUpdateSelect :any = [];
    if(this.asAdmin === true){
      userUpdateSelect = this.userSource 
    }else{
      userUpdateSelect = this.AccountOfUser 
    }
    userUpdateSelect.trainings = [];
    this.userHandlersServiceCustomer.updateAccount(userUpdateSelect).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        console.log('la resp du update account: ! ', response)
        // this.getDetails(account.owner);
        if(this.asAdmin === false){
          localStorage.setItem('account', JSON.stringify(response.account));
          this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        }else{
          localStorage.setItem('account-data-user', JSON.stringify(response.account));
          let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
          console.log('LE DETAIL DU USER : ! ',userDetailAccount)
          this.userSource = userDetailAccount;
        }
        this.getExercicesList()
      })
    })
  }

  selectExercices(event:any,item:any){
    console.log('Choose de l\'exercice :',event.checked,item)
    console.log('somme nous en asAdmin?', this.asAdmin)

    let userUpdateSelect :any = [];
    if(this.asAdmin === true){
      userUpdateSelect = this.userSource 
    }else{
      userUpdateSelect = this.AccountOfUser 
    }
    console.log(userUpdateSelect.trainings)
    if(event.checked === true){
      userUpdateSelect.trainings.push(item.header.id)
      // update Account :
      console.log(userUpdateSelect.trainings)
      this.userHandlersServiceCustomer.updateAccount(userUpdateSelect).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          console.log('la resp du update account: ! ', response)
          // this.getDetails(account.owner);
          if(this.asAdmin === false){
            localStorage.setItem('account', JSON.stringify(response.account));
            this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
          }else{
            localStorage.setItem('account-data-user', JSON.stringify(response.account));
            let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
            console.log('LE DETAIL DU USER : ! ',userDetailAccount)
            this.userSource = userDetailAccount;
          }
          
        })
      });
    }else{
      userUpdateSelect.trainings = userUpdateSelect.trainings.filter((training:any) => training !== item.header.id)
      console.log('Le nouvel array : ! ',userUpdateSelect.trainings)
      this.userHandlersServiceCustomer.updateAccount(userUpdateSelect).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          console.log('la resp du update account: ! ', response)
          // this.getDetails(account.owner);
          if(this.asAdmin === false){
            localStorage.setItem('account', JSON.stringify(response.account));
            this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
          }else{
            localStorage.setItem('account-data-user', JSON.stringify(response.account));
            let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
            console.log('LE DETAIL DU USER : ! ',userDetailAccount)
            this.userSource = userDetailAccount;
          }
          
        })
      });
    }
   
  }

  getExercicesList(){
  console.log('le user source : ! ',this.userSource)
  if(this.asAdmin === true){
    if(this.userSource !== undefined ){
      this.exerciseService.getExerciceList(this.userSource.id).then((resp:any)=>{
        console.log(this.userSource)
        resp.subscribe((response:any)=>{
          if(response.response.result === 'success'){
            // console.log('LA RESP DANS TRAINING : ',response)
            console.log('LA RESP DANS TRAINING : ',response.publicExercises)
            this.publicTrainings.cards = response.publicExercises;
            this.publicTrainings.cards.forEach((exo:any)=>{
              exo.selected = false;
              this.userSource.trainings.forEach((training:any) =>{
                if(exo.header.id === training ){
                  console.log('nous avons trouvé l\'exo selectionné ! ',training, exo)
                  exo.selected = true;
                }
              })
              if(exo.header.image === ''){
                exo.header.image = '../../../assets/images/default_100.jpg'
              }
            })
            this.privateTrainings.cards = response.privateExercises;
            this.privateTrainings.cards.forEach((exo:any)=>{
              exo.selected = false;
              this.userSource.trainings.forEach((training:any) =>{
                if(exo.header.id === training ){
                  console.log('nous avons trouvé l\'exo selectionné ! ',training, exo)
                  exo.selected = true;
                }
              })
              if(exo.header.image === ''){
                exo.header.image = '../../../assets/images/default_100.jpg'
              }
            })
            // console.log('LA RESP DANS TRAINING : ',this.publicTrainings.cards)
          }
        })
        this.disabledSpinner = false;
      });
    }  
  }
  else{
    this.exerciseService.getExerciceList(this.idOfOwner).then((resp:any)=>{
      // Lors d'un mode normal
      resp.subscribe((response:any)=>{
        if(response.response.result === 'success'){
          // console.log('LA RESP DANS TRAINING : ',response)
          // console.log('LA RESP DANS TRAINING : ',response.publicExercises)
          this.publicTrainings.cards = response.publicExercises;
          this.publicTrainings.cards.forEach((exo:any)=>{
              exo.selected = false;
              this.AccountOfUser.trainings.forEach((training:any) =>{
              if(exo.header.id === training ){
                console.log('nous avons trouvé l\'exo selectionné ! ',training, exo)
                exo.selected = true;
              }
            })
            if(exo.header.image === ''){
              exo.header.image = '../../../assets/images/default_100.jpg'
            }
            // console.log('ACCOUNT OF USER TRAININGS NOMBRE D\'EXOS SELECTIONNés:! : ', this.AccountOfUser.trainings);

          })
          this.privateTrainings.cards = response.privateExercises;
          
            this.privateTrainings.cards.forEach((exo:any)=>{
             
              exo.selected = false;
              this.AccountOfUser.trainings.forEach((training:any) =>{
              if(exo.header.id === training ){
                console.log('nous avons trouvé l\'exo selectionné Private! ',exo,training)
                exo.selected = true;
              }  
            })
            if(exo.header.image === ''){
              exo.header.image = '../../../assets/images/default_100.jpg'
            }
          })
          this.disabledSpinner = false;
          // console.log('LA RESP DANS TRAINING : ',this.publicTrainings.cards)
        }
      })
      // 
    });
  }
  }

  getSessionsList(){
  console.log('SESSION : ',this.userSource)
  if(this.userSource !== undefined){
    this.exerciseService.getSessionList(this.userSource.id).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        if(response.response.result === 'success'){
          // console.log('LA RESP DANS SESSIONS : ',response)
          // console.log('LA RESP DANS SESSIONS : ',response.publicSessions)
          this.publicSessions.cards = response.publicSessions;
          this.privateSessions.cards = response.privateSessions;
          this.publicSessions.cards.forEach((session:any)=>{
            if(session.header.image === ''){
              session.header.image = '../../../assets/images/default_100.jpg'
            }
          })
          this.privateSessions.cards.forEach((session:any)=>{
            if(session.header.image === ''){
              session.header.image = '../../../assets/images/default_100.jpg'
            }
          })
          // console.log('LA RESP DANS SESSIONS : ',this.publicSessions.cards)
        }
      })
    });
  }else{
    console.log('SESSION : ',this.idOfOwner)
    this.exerciseService.getSessionList(this.idOfOwner).then((resp:any)=>{
      console.log(resp)
      resp.subscribe((response:any)=>{
        if(response.response.result === 'success'){
          // console.log('LA RESP DANS SESSIONS : ',response)
          // console.log('LA RESP DANS SESSIONS : ',response.publicSessions)
          this.publicSessions.cards = response.publicSessions;
          this.privateSessions.cards = response.privateSessions;
          this.publicSessions.cards.forEach((session:any)=>{
            if(session.header.image === ''){
              session.header.image = '../../../assets/images/default_100.jpg'
            }
          })
          this.privateSessions.cards.forEach((session:any)=>{
            if(session.header.image === ''){
              session.header.image = '../../../assets/images/default_100.jpg'
            }
          })
          // console.log('LA RESP DANS SESSIONS : ',this.publicSessions.cards)
        }
      })
    });
  }
    
  }

  compareByName(a:any, b:any) {
    return a.header.title.localeCompare(b.header.title);
  }
  

  displayTypeOf:any = "list"
  changeDisplay(type:any){
    this.displayTypeOf = type; 
  }

  applyFilter(event: Event) {
    console.log('LE SEARCH : ',event)
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('LE SEARCH : ',filterValue.trim().toLowerCase())
    // this.publicTrainings.cards = 
    // this.publicTrainings.cards.filter = filterValue.trim().toLowerCase();
  }


  openDialog(item:any) {
    let dataAccount:any=[];
    // if(this.userSource !== undefined ){
    //   dataAccount = this.userSource;
    // }else{
      dataAccount = this.AccountOfUser;
    // }
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: {item: item, account:dataAccount },
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  select(itemer:any){
    this.chooseType = itemer.value;
    this.itemsNav.forEach((item:any)=>{
      if(item.type === itemer.type){ item.selected = true;
      }else{ item.selected = false;}
    })
  }

  createExercice(){
    this.router.navigate(['exercices-editor']);
  }

  subscribes(){
    this.router.navigate(['subscribes']);
  }

  uploadExercice(){
    console.log('go upload exercice :!: ');
    const dialogRef = this.dialog.open(ContentUploadDialog, {
      // data: {item: item},
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.getExercicesList();
      }, 1000);
      console.log(`Dialog result: ${result}`);
    });
  }

  uploadSession(){
    console.log('go upload session :!: ');
    const dialogRef = this.dialog.open(SessionUploadDialog, {
      // data: {item: item},
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        // this.getSessionsList();
      }, 1000);

      console.log(`Dialog session result: ${result}`);
    });
  }

  createSession(){

  }

}



@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./trainings.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
})
export class DialogContentExampleDialog implements OnInit{
  audience:string='public';
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
    console.log('LES DATAS MODALS  : ! ',this.data)
   console.log('LES DATAS MODALS ',this.data.account.role)
  }

  addVideoToExercice(data:any){
    console.log('Les datas de l\'exercices',data)
  }

  downloadJson(dataJson:any){
    console.log('DATA EXO ; : §',dataJson)
    let fileName = dataJson.header.id+'.json';
    var blob = new Blob([JSON.stringify(dataJson)], { type: 'application/json;charset=utf-8' });
    console.log('UPDATE JSON:',blob)
    var a = document.createElement("a"),
    url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
   setTimeout(function() {
     document.body.removeChild(a);
     window.URL.revokeObjectURL(url);
   }, 0);
  }

}


@Component({
  selector: 'content-upload',
  templateUrl: 'content-upload.html',
  styleUrls: ['./trainings.component.scss'],
  standalone: true,
  imports: [ MatRadioModule, CommonModule, MatDialogModule, FormsModule, MatButtonModule],
})
export class ContentUploadDialog implements OnInit{
  // audience:string='public';
  dataJson:any;
  dataImg:any;
  dataBase64:any = "";
  status_private =false;
  status_public =false;
  idOfUser = "";
  userDetailAccount:any;
  constructor(
    private utilsService: UtilsService,
    public exerciseService:ExerciseService,
    public dialogRef: MatDialogRef<ContentUploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {
    this.idOfUser = "";
  }

  ngOnInit(): void {
    this.userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
    console.log('LE DETAIL DU USER : ! ',this.userDetailAccount)
    console.log('LES DATAS MODALS  : ! ',this.data.header.image)
    if(this.userDetailAccount.id !== undefined){
      this.idOfUser = this.userDetailAccount.id;
    }

  }

  onchangeInput(file:any){
    console.log('FILE : ! ',file.target.files)
    console.log('FILE : ! ',file.target.files[0])
    let selectedFile = file.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      if(fileReader.result !== null){
        //console.log(fileReader.result.toString());
      let jsonObj = (JSON.parse(fileReader.result.toString()));
      console.log(jsonObj)
      this.dataJson = jsonObj;
        if(this.dataJson.header.status === 'public' ){
          this.status_public = true;
          this.status_private = false;
        }else{
          this.status_public = false;
          this.status_private = true;
        }
      }
      fileReader.onerror = (error) => {
      console.log(error);
      }
    }
  }


  selectStatus(value:any){
    console.log('LA VALUE DU CHECK: ! ',value.value, this.dataJson)
    if(this.dataJson !== undefined){
      this.dataJson.header.status = value.value;
    }
  }

  // https://www.npmjs.com/package/image-resize
  onchangeInputImg(file:any){
    // 
    var imageResize = new ImageResize({
      format: 'jpg',
      width: 256
    });
    
    imageResize.play(file.target.files[0]).then((e:any)=>{
      this.dataBase64 = e;
      console.log(file)
      console.log(this.dataBase64)
    });
  }

  saveDataFromJson(){
    let uuid = '';
    uuid = uid(32);
    console.log('DATA BEFORE SENDING : ',this.dataJson, this.dataImg, this.dataBase64);
    if(this.dataBase64 !== ""){
      this.dataJson.header.image = this.dataBase64;
    }else{
      this.dataJson.header.image = "";
    }

    if(this.idOfUser !== ""){
      if(this.dataJson.header.status === 'private'){
        console.log('On va update un private : ', this.idOfUser, this.userDetailAccount,this.userDetailAccount.trainings )
        console.log('DATA DU JSON : ', this.dataJson )
        console.log('On va update un private : ', this.userDetailAccount )
        // update en base
        this.exerciseService.updateExercise(this.dataJson, this.userDetailAccount.id);
      }
    }else{
      let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
      console.log('LE DETAIL DU USER : ! ',AccountOfUser, uuid)
      //
  
      this.exerciseService.updateExercise(this.dataJson, AccountOfUser.id);
    }
    
  }

}

@Component({
  selector: 'session-upload',
  templateUrl: 'session-upload.html',
  styleUrls: ['./trainings.component.scss'],
  standalone: true,
  imports: [ MatRadioModule, CommonModule, MatDialogModule, FormsModule, MatButtonModule],
})
export class SessionUploadDialog implements OnInit{
  // audience:string='public';
  dataJson:any;
  dataImg:any;
  dataBase64:any = "";
  status_private =false;
  status_public =false;
  idOfUser = "";
  userDetailAccount:any;
  constructor(
    private utilsService: UtilsService,
    public exerciseService:ExerciseService,
    public dialogRef: MatDialogRef<SessionUploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {
    this.idOfUser = "";
  }

  ngOnInit(): void {
    this.userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
    console.log('LE DETAIL DU USER : ! ',this.userDetailAccount)
    if(this.userDetailAccount.id !== undefined){
      this.idOfUser = this.userDetailAccount.id;
    }

  }

  onchangeInput(file:any){
    console.log('FILE : ! ',file.target.files)
    console.log('FILE : ! ',file.target.files[0])
    let selectedFile = file.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      if(fileReader.result !== null){
        //console.log(fileReader.result.toString());
      let jsonObj = (JSON.parse(fileReader.result.toString()));
      console.log(jsonObj)
      this.dataJson = jsonObj;
        // if(this.dataJson.header.status === 'status_public' ){
        //   this.status_public = true;
        //   this.status_private = false;
        // }else{
        //   this.status_public = false;
        //   this.status_private = true;
        // }
      }
      fileReader.onerror = (error) => {
      console.log(error);
      }
    }
  }


  selectStatus(value:any){
    console.log('LA VALUE DU CHECK: ! ',value.value, this.dataJson)
    if(this.dataJson !== undefined){
      this.dataJson.header.status = value.value;
    }
  }

  // https://www.npmjs.com/package/image-resize
  onchangeInputImg(file:any){
    var imageResize = new ImageResize({
      format: 'jpg',
      width: 256
    });
    imageResize.play(file.target.files[0]).then((e:any)=>{
      this.dataBase64 = e;
      console.log(file)
      console.log(this.dataBase64)
    });
  }

  saveDataFromJson(){
    let uuid = '';
    uuid = uid(32);
    console.log('DATA BEFORE SENDING : ',this.dataJson, this.dataImg, this.dataBase64);
    if(this.dataBase64 !== ""){
      this.dataJson.header.image = this.dataBase64;
    }else{
      this.dataJson.header.image = "";
    }

    if(this.idOfUser !== ""){
      if(this.dataJson.header.status === 'private'){
        console.log('On va update un private : ', this.idOfUser, this.userDetailAccount,this.userDetailAccount.trainings )
        console.log('DATA DU JSON : ', this.dataJson )
        // this.userDetailAccount.trainings.push({id:this.dataJson.header.id});
        console.log('On va update un private : ', this.userDetailAccount )
        this.exerciseService.updateSession(this.dataJson, this.userDetailAccount.id);
        // update en base
      }else{

      }
    }else{
      let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        console.log('LE DETAIL DU USER : ! ',AccountOfUser, uuid)
        //

        this.exerciseService.updateSession(this.dataJson, AccountOfUser.id);
    }
 
  }

}
