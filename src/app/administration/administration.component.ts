import { Injectable, Component, OnInit, Inject, ViewChild, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective, FormGroup } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule , } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher} from '@angular/material/core';
import { SafeUrl } from '@angular/platform-browser';
import { FireStoreServiceImages } from '../../services/firebase/firestoreservice-images';
import { UserHandlersServiceAdmin } from '../../services/user-handlers-admin.service';
import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';
import { UserHandlerHistoricalService } from '../../services/user-handlers-historical.service';
import { uid } from 'uid';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { DatePipe } from '@angular/common';
import { storageServiceMail } from '../../services/firebase/mail.service';
import { UtilsService } from '../../services/utils.service';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QRCodeElementType } from "angularx-qrcode";
import { FixMeLater } from "../../../angularx-qrcode/src/public-api"
import { single } from './data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { GocardlessService } from '../../services/gocardless.service';
import { StripeServices } from '../../services/stripe.service';
import {MatAccordion} from '@angular/material/expansion';


type ListType = { title: string; val: number }[];


@Component({
  selector: 'snack-bar',
  templateUrl: './snack/snack-bar.html',
  styles: [
    `:host { display: flex;}
    .example-pizza-party { color: black;}
    `,],
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
})


export class snackComponent {
  snackBarRef = inject(MatSnackBarRef);
}



export interface AccountDatas {
  avatarImages:string,
  date:string,
  dateIso:string,
  econes:[],
  email:string,
  moderate:{date: string, lastcodateIso: string, moderatereason: any},
  personalInfos:{
    comment: string,
    birthdate: string,
    name: string,
    address:string,
    city:string,
    email:string,
    firstname:string,
    phone:string,
    simplebirthdate:string,
    zip:string,
  },
  privileges:{ rights: []},
  staff:[],
  traineds:[],
  update:string,
  uuid:string
}


export interface ProfilAccountDatas{
  avatarimages:string,
  date:string,
  dateIso:string,
  econes:[],
  email:string,
  moderate:{date: string, lastcodateIso: string, moderatereason: any},
  personalinfos:{
    comment: string,
    birthdate: string,
    name: string,
    address:string,
    city:string,
    email:string,
    firstname:string,
    phone:string,
    simplebirthdate:string,
    zip:string,
  },
  privileges:{role: string, rights: [], licences: number},
  staff:[],
  traineds:[],
  update:string,
  uuid:string
}


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})



export class AdministrationComponent implements OnInit{
  panelOpenState = false;
  // ,'date'
  displayedColumnsAccounts: string[] = ['firstName', 'familyName', 'date', 'moderation', 'actions'];
  // 
  // , 'role', 'licences', 'date', 'actions', 'moderation'
  dataSourceAccounts!: MatTableDataSource<any>;

  displayedColumnsProfilAccount: string[] = ['firstName', 'role', 'licences', 'date', 'actions', 'moderation'];
  dataSourceProfilAccount!: MatTableDataSource<any>;
  Accounts:any[]=[];
  ProfilAccount:any;
  name: string ="";
  widthcard:number=0;
  heigthCard:number=0;
  isChecked = false;
  isModerate = 'non';
  single: any ;
  view: any = [700, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';
  colorScheme:any = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']};
  saleData = [
    { name: "Membres", value: 56 },
    { name: "Exercices", value: 122 },
    { name: "Vidéos", value: 50 },
  ]
  chartData =  [
    { "name": "test1",
    "series": [ { "name": 87,"value": 45}, { "name": 41, "value": 801} ]
    },
    { "name": "test2",
    "series": [ { "name": 101, "value": 12},{"name": 126,"value": 12}]
    }
  ];

  //QR INITIALIZER
  public initial_state = {
    allowEmptyString: true, alt: "E-cone",
    ariaLabel: `Qr code`, colorDark: "#031722",
    colorLight: "#ffffffff", cssClass: "center",
    elementType: "canvas" as QRCodeElementType,
    errorCorrectionLevel: "H" as QRCodeErrorCorrectionLevel,
    imageSrc: "./assets/images/logoD.jpg",
    imageHeight: 45, imageWidth: 45,
    margin: 4, qrdata: "https://drilllight.com/Cordobo/angularx-qrcode",
    scale: 1, version: undefined, title: "E-cone", width: 200,
  }


  public data_model = { ...this.initial_state }
  public allowEmptyString: boolean = false;
  public alt!: string;
  public ariaLabel!: string;
  public colorDark!: string;
  public colorLight!: string;
  public cssClass!: string;
  public elementType: QRCodeElementType = "url";
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel = "low";
  public imageSrc?: string
  public imageHeight?: number
  public imageWidth?: number
  public margin!: number;
  public qrdata!: string;
  public scale!: number;
  public title!: string;
  public width!: number;
  public qrCodeSrc!: SafeUrl;
  public selectedIndex!: number;
  public showA11y: boolean = false;
  public showColors: boolean = false;
  public showCss: boolean = false;
  public showImage: boolean = false;


  resultsLength = 0;
  // TABLE INIT
  AccountOfUser:any=[];
  @ViewChild('paginatorAccounts')
  paginatorAccounts!: MatPaginator;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('paginatorProfilAccount')
  paginatorProfilAccount!: MatPaginator;
  namer = new FormControl('');
  email = new FormControl('');


  constructor(
    private stripeServices:StripeServices,
    private _snackBar: MatSnackBar,
    private utilsService: UtilsService,
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    public dialog: MatDialog,
    private gocardlessService:GocardlessService,
    private router: Router
  ){

    // DATA INIT
    Object.assign(this, { single });
    this.selectedIndex = 0
    this.showA11y = true
    this.showColors = true
    this.showCss = true
    this.showImage = true
    this.allowEmptyString = this.data_model.allowEmptyString
    this.alt = this.data_model.alt
    this.ariaLabel = this.data_model.ariaLabel
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.imageSrc = this.showImage ? this.data_model.imageSrc : undefined
    this.imageHeight = this.showImage ? this.data_model.imageHeight : undefined
    this.imageWidth = this.showImage ? this.data_model.imageWidth : undefined
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width
  }

  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
    });
    this.utilsService._newaccount.subscribe((update:any) =>{
      console.log('ALLONS NOUS UPDATE ? ',update)
       if(update !== null){
         if(update == true){
          this.Accounts = [];
          let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
          console.log('ICI ADMIN NEW ACCOUNT :: ',this.AccountOfUser)
          // console.log('ICI ADMIN ACOUNTS : !:: ',allAccounts)
          this.Accounts.length = 0
          allAccounts.forEach((account:any)=>{
            this.Accounts.push(account.data)
            console.log('ICI ADMIN ACOUNTS : !:: ',this.Accounts)
          });
          this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
          this.dataSourceAccounts.paginator = this.paginatorAccounts;
          this.resultsLength = this.Accounts.length;
          // console.log('ACCOUNT OF USERS :! : ', allAccounts, 'le  ACCOUNT ACTUEL : ! ', this.ProfilAccount );
          // this.Accounts = allAccounts;
          // if(this.ProfilAccount !==  undefined && this.ProfilAccount.email !== undefined){
          //   this.Accounts.forEach((account:any) =>{
          //     if(this.ProfilAccount.email === account.email){
          //       console.log('CE COMPTE EST LE MEME !! ',account);
          //       this.ProfilAccount = account;
          //     }
          //   });
          // }
          // this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
          // this.dataSourceAccounts.paginator = this.paginatorAccounts;
          // if(this.ProfilAccount.email)
          this._snackBar.openFromComponent(snackComponent, { duration:  1000,});
          //     this.letsee = true;
          //  this.ProfilAccount = {data: this.AccountOfUser};
        }
      }
    })
    // this.utilsService._newDataOCustomerAccounts.subscribe((update:any) =>{
    //   if(update !== null){
    //     if(update.data == true){
    //       this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    //       console.log('ACCOUNT OF USER UPDATE:! : ', this.AccountOfUser);
    //       this.letsee = true;
    //       this.ProfilAccount = {data: this.AccountOfUser};}
    //   }
    // })
    this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
    // console.log('ACCOUNT OF USER :! : ',this.AccountOfUser)
    if(this.AccountOfUser.asAdmin == true){
      // this.getAdminCustomerUsers();
      console.log('ICI ADMIN :: ',this.AccountOfUser)
      let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
      // console.log('ICI ADMIN ACOUNTS : !:: ',allAccounts)
      this.Accounts.length = 0
      allAccounts.forEach((account:any)=>{
        this.Accounts.push(account.data)
        console.log('ICI ADMIN ACOUNTS : !:: ',this.Accounts)
      });
      console.log('ICI ADMIN ACOUNTS : !:: ',this.Accounts)
      this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
      this.resultsLength = this.Accounts.length;
      this.dataSourceAccounts.paginator = this.paginatorAccounts;
      // console.log( this.dataSourceAccounts)
      //   this.utilsService._getModerateOption.subscribe((moderation:any) => {
      //     let getAccounts:any[] = []
      //     console.log('MODERATION !: ',this.Accounts, moderation)
      //     this.Accounts.forEach((account:any) => {
      //       getAccounts.push(account)
      //       console.log(account.data.email, moderation.account.data.email)
      //       if(account.data.email === moderation.account.data.email){
      //         account.data.moderate = moderation.data.moderate;
      //         account.moderate = moderation.data.moderate;
      //         console.log('ELEMENT REçU DE MODéRATION : ! ',account.data.moderate, moderation.data.moderate)
      //         account.data.traineds.forEach((trained:any)=>{
      //           console.log('LES ENTRAINES :! :',trained)
      //           // trained.moderate.moderatereason.moderate =
      //         });
      //       }
      //       console.log('LES COMPTES: ! ',getAccounts);
      //     });
      //   });
      // }else{
      //   console.log('ICI NON ADMIN :: ',this.AccountOfUser)
      //   this.letsee = true;
      //   this.ProfilAccount = {data: this.AccountOfUser};
    }
  }


  // CHARTS LINE UP
  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  // CHARTS LINE UP END

  // CREATE ADMIN !!
  createAdmin(){
    const dialogRef = this.dialog.open(DialogCreateAdmin, {
      panelClass: 'bg-color',
      width:'80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }


  selectedCharts :any = []
  Charts :any[]=["Staff/Utilisateurs", "Données Exercices", "Statistiques"];
  selectChangeChart(event:any){
    console.log('CHOOSE OF CHARTS : ',event.value)
    this.selectedCharts = event.value;
  }

  displayModalSend = false;
  closeModalSend(){
    this.displayModalSend = false;
  }

  updateAccount(account:any){
    console.log('WHAT UPDATE ?',account)
    this.letsee = false;
    if(account.asAdmin == true){
      const dialogRef = this.dialog.open(DialogCreateAdmin, {
        data:account,
        panelClass: 'bg-color',
        width:'80%',
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.getAdminCustomerUsers();
      });
    }else{
      const dialogRef = this.dialog.open(DialogCreateCustomer, {
        data:account,
        panelClass: 'bg-color',
        width:'80%',
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.getAdminCustomerUsers();
      });
    }
  }

  letsee = false;
  seeAdmin(account:any){
    this.letsee = true;
    this.ProfilAccount = account;
    console.log('DETAILS ACCOUNT : !',this.ProfilAccount, this.ProfilAccount.privileges.rights)
    this.dataSourceProfilAccount = new MatTableDataSource(this.ProfilAccount);
    this.dataSourceProfilAccount.paginator = this.paginatorProfilAccount;
  }

  createfromDashboard(){


  }
  dataOfHistory = [];
  uploadCsv(event:any){
    console.log('EVENT : ! ',event)
    var files = event.target.files; // FileList object
    var file = files[0];

    console.log('FILE=  ' ,file);
    var reader = new FileReader();
    console.log('READER ' ,reader);
    reader.readAsText(file);
    reader.onload = ev => {
      if(reader.result !== null){
        let csvdata = reader.result.toString();
        let body = {data:csvdata};
        // let csvdataJSON = JSON.parse(csvdata);
        console.log('BODY DATA  : ! ',csvdata);
        this.userHandlersServiceCustomer.sendCsvToApi(csvdata, this.ProfilAccount).then(el =>{

          this.dataOfHistory = el.exercices;
          console.log('RESULT :: ! ',this.dataOfHistory)
        })
        event.target.value = '';
        // .then((resp:any)=>{
        //   console.log('resp from serveur', resp);
        // })
      }
      // return this.http.post('apiurl',body).subscribe((data:any)=>{
      //   console.log(JSON.stringify(data.json))
      // });
    };

  }

  uploadJsonExercice(event:any){
    console.log('EVENT : ! ',event)
    var files = event.target.files; // FileList object
    var file = files[0];

    console.log('FILE=  ' ,file);
    var reader = new FileReader();
    console.log('READER ' ,reader);
    reader.readAsText(file);
    reader.onload = ev => {
      if(reader.result !== null){
        let jsondata = reader.result.toString();
        let body = {data:jsondata};
        // let csvdataJSON = JSON.parse(csvdata);
        console.log('BODY DATA  : ! ',jsondata);
        this.userHandlersServiceCustomer.sendJsonToApi(jsondata, file.name, this.ProfilAccount).then(el =>{
          console.log('RESULT :: ! ',el)
          // this.dataOfHistory = el.exercices;
          // console.log('RESULT :: ! ',this.dataOfHistory)
      })
      // event.target.value = '';
     }
  }
  }

  getClientsGocard(){
    this.gocardlessService.getClientsGocard().then((el:any) =>{
      console.log('RESULT GO CARD:: ! ',el)
      // this.dataOfHistory = el.exercices;
      // console.log('RESULT :: ! ',this.dataOfHistory)
  })
  }

  setClientsGoSubscribeStripe(email:any, namer:any){

  }

  createToken(email:any, namer:any){
    // console.log('go stripe service : ! ',email,   namer  )
    // let body = {data:{email:email, name:namer}};
    // this.stripeServices.setClientStripePaiementLink(body, this.ProfilAccount).then((el:any) =>{
    //   console.log('RESULT GO CARD:: ! ',el)
    this.router.navigate(['stripe']);
      // this.email.value
      // this.dataOfHistory = el.exercices;
      // console.log('RESULT :: ! ',this.dataOfHistory)
  // })

  }

  setClientsGocardStripe(email:any, namer:any){
    console.log('go stripe service : ! ',email,   namer  )
    let body = {data:{email:email, name:namer}};
    this.stripeServices.setClientStripe(body, this.ProfilAccount).then((el:any) =>{
      console.log('RESULT GO CARD:: ! ',el)

      this.email.value
      // this.dataOfHistory = el.exercices;
      // console.log('RESULT :: ! ',this.dataOfHistory)
  })
  }

  gotoHistory(){
    this.utilsService.sendNewHistory(this.dataOfHistory);
    this.router.navigate(['history']);
  }

  letSeeAccount:any;
  seeTheSameAdmin(account:any){
    console.log('ON VEUT CE COMPTE :!  ',account)
    this.utilsService.sendOfCustomerProfilOptions({account:account, seeAs : true});
    this.router.navigate(['dashboard']);
  }

  backToList(){
    this.letsee = false;
    this.ProfilAccount = undefined;
  }

  createCustomer(){
    const dialogRef = this.dialog.open(DialogCreateCustomer, {
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }


  onChangeURL(url: SafeUrl) {
    this.qrCodeSrc = url
  }

  saveAsImage(parent: FixMeLater, econe:any) {
    let parentElement = null
    if (this.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.elementType === "img" || this.elementType === "url") {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = econe.id
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }


  changeModeration(account:any){
    console.log('DATA TO SEND ',account.data.moderate)
    let data = {moderate: account.data.moderate }

    console.log('LES DATAS AVANT DE DELETE',data)
    this.userHandlersServiceCustomer.moderateAccountCustomer(account, data);
    // this.getAdminCustomerUsers();
  }

  applyFilter(event: Event) {
    console.log('LE SEARCH : ',event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAccounts.filter = filterValue.trim().toLowerCase();
  }

  //Trained
  seeTrainedProfil(trained:any){
    this.utilsService.sendUserAccountData(trained);
    this.router.navigate(['profil']);
  }

  updateAccountTrained(ProfilAccount:any , trained:any){
    console.log('Create a user of group!', trained);
    let update = {ProfilAccount:ProfilAccount, trained:trained}
    const dialogRef = this.dialog.open(DialogCreateUser, {
      data:update,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }

  sendResetPasswordTrained(trained:any){
    console.log(trained)
    this.displayModalSend =true;
      // if (!this.email) {
      //   alert('Type in your email first');
      // }
      // this.auth.resetPasswordInit(this.email)
      // .then(
      //   () => alert('A password reset link has been sent to your email
      //   address'),
      //   (rejectionReason) => alert(rejectionReason))
      // .catch(e => alert('An error occurred while attempting to reset
      //   your password'));
  }

  //STAFF

  seeStaffProfil(trained:any){

  }

  updateAccountStaff(ProfilAccount:any , trained:any){
    console.log('Create a user of group!', trained);
    let update = {ProfilAccount:ProfilAccount, trained:trained}
    const dialogRef = this.dialog.open(DialogCreateStaff, {
      data:update,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }

  sendResetPasswordStaff(trained:any){
    console.log(trained)
      // if (!this.email) {
      //   alert('Type in your email first');
      // }
      // this.auth.resetPasswordInit(this.email)
      // .then(
      //   () => alert('A password reset link has been sent to your email
      //   address'),
      //   (rejectionReason) => alert(rejectionReason))
      // .catch(e => alert('An error occurred while attempting to reset
      //   your password'));
  }

  sendResetPassword(account:any){
    console.log(account.data.email)
      if (!account.data.email) {
        alert('Type in your email first');
      }
      this.afAuth.sendPasswordResetEmail(account.data.email).then(
        () => alert('A password reset link has been sent to your email address'),
         (rejectionReason:any) => alert(rejectionReason))
       .catch((e:any) => alert('An error occurred while attempting to reset your password'));
  }

  updateCustomer(account:any){

  }

  addAccountOfGroup(ProfilAccount:any){
    console.log('Create a user of group!', ProfilAccount);
    const dialogRef = this.dialog.open(DialogCreateUser, {
      data:ProfilAccount,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }

  addStaffOfGroup(ProfilAccount:any){
    console.log('Create a user of group!', ProfilAccount);
    const dialogRef = this.dialog.open(DialogCreateStaff, {
      data:ProfilAccount,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAdminCustomerUsers();
    });
  }

  econeAdministration(){
    this.utilsService.sendAdminToEcone({account:this.Accounts});
    this.router.navigate(['econes']);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //condition true
    const isSubmitted = form && form.submitted;
    //false
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'dialog-create-admin',
  templateUrl: './dialog/dialog-create-admin.html',
  styleUrls: ['./administration.component.scss'],
  standalone: true,
  imports: [  ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogCreateAdmin implements OnInit{
  [x: string]: any;
  // roles: string[] = ['Club Gold', 'Club Siver', 'Club', 'Staff Gold', 'Staff Silver', 'Staff','Joueur Gold','Joueur Silver', 'Joeur'];
  rights: string[] = ['Videos', 'Edition Exercices','Bouquet Exercices','Exercices', 'Edition Vidéos', 'Logs', 'Dashboard', 'Administration', 'Entrainements'];
  selectedRights:any[]=[];
  familyName = new FormControl('', [ Validators.required ]);
  firstName = new FormControl('', [ Validators.required ]);
  email = new FormControl('', [ Validators.required ]);
  phone = new FormControl('', [ Validators.required ]);
  address = new FormControl('', [ Validators.required ]);
  zip = new FormControl('', [ Validators.required ]);
  city = new FormControl('', [ Validators.required ]);
  selectedFile!: File;
  comment= new FormControl('');
  birthdate:any='';
  simpleBirthdate:any='';
  audience:string='public';
  rightsUser:any[]=[];
  AdminAccounts:any[]=[];
  eventImageFile:any;
  uploadedImages:any;
  update=false;
  constructor(
    private utilsService:UtilsService,
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    public dialog: MatDialog,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    public dialogRef: MatDialogRef<DialogCreateAdmin>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
   console.log('LES DATAS MODALS ',this.data)
   if(this.data !== null){
    if(this.data.data !== null){
      this.update = true;
      this.familyName.setValue(this.data.personalInfos.familyName);
      this.firstName.setValue(this.data.personalInfos.firstName);
      this.email.setValue(this.data.personalInfos.email);
      this.phone.setValue(this.data.personalInfos.phone);
      this.address.setValue(this.data.personalInfos.address);
      this.zip.setValue(this.data.personalInfos.zip);
      this.city.setValue(this.data.personalInfos.city);
      this.comment.setValue(this.data.personalInfos.comment);
      this.selectedRights =  this.data.privileges.rights;
      this.simpleBirthdate = this.data.personalInfos.simpleBirthdate;
      console.log( 'SELECTED RIGHTS :! ',this.data, this.selectedRights)
     }
    }
  }
  closeModal(){
    // avatarimages: this.eventImageFile,
    let data = {avatarImages: this.eventImageFile, firstName:  this.firstName.value,familyName:this.familyName.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,rights: this.rightsUser, birthdate:this.birthdate,simpleBirthdate: this.simpleBirthdate,asAdmin:true}
    if(this.update === false){
      this.userHandlersServiceAdmin.addAccountAdmin(data);
    }else{
      console.log('SELECTED RIGHTS : ',this.selectedRights,this.rightsUser)
      this.fireStoreServiceImages.addImagesOfAdministrator(this.data.id, this.eventImageFile);
      this.userHandlersServiceAdmin.updateAccountAdmin(this.data.id, data);
    }
    setTimeout(() => {
      this.dialogRef.close(data);
      console.log('on email user aout')
      let passWord = 'Drilllight2023';

      this.dialogRef.close(data);
      if(this.email.value !== null ){
        if(this.update === false){
          this.update = false;
          // the create user on Firebase
          this.afAuth.createUserWithEmailAndPassword(this.email.value, passWord).then((result) => {
            // window.alert('You have been successfully registered!');
            console.log('You have been successfully registered!',result.user);
            this.storageServiceMail.addMailAdmin(this.email.value, this.familyName.value)
          })
          .catch((error) => {
            window.alert(error.message);
          });
        }
      }
      console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord)

    }, 700);

  }

  sendResetPassword(account:any){
    // let email service worker  !

  }

  confirmModeration(){
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data:this.data,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      // console.log('LES DATAS AFTER : !',this.data);
      // console.log('RESULT OF MODERATION :',result)
      this.utilsService.changeModerateOption(result);
      console.log('RESULT OF MODERATION CUSTOMER :',result, this.data)
      this.data.moderation = result;
      this.data.data.moderate.moderatereason.moderate = result;
      const dialogRef = this.dialog.open(DialogCreateAdmin, {
        data:this.data,
        panelClass: 'bg-color',
        width:'80%'
      });
      console.log(result)
    });
  }

  onFileChanged(event:any) {
    this.eventImageFile = [];
    this.eventImageFile = event;
    this.selectedFile = event.target.files[0];
  }

  urlImg:any;
  onUpload() {
    this.urlImg = [];
    // upload code goes here
    console.log('SELECTED FILE :: ',this.selectedFile)
    let reader = new FileReader();
    if(this.selectedFile !==  undefined) {
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.urlImg = reader.result;
      };
    }
  }

  dateChange(event:any){
    this.birthdate = event.value;
    this.simpleBirthdate = event.targetElement.value;
  }

  selectChange(event:any){
    console.log(event.value);
    this.rightsUser = event.value;
  }
  matcher = new MyErrorStateMatcher();
}

@Component({
  selector: 'dialog-create-customer',
  templateUrl: './dialog/dialog-create-customer.html',
  styleUrls: ['./administration.component.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogCreateCustomer implements OnInit{
  rights: string[] = ['Videos', 'Edition Exercices','Bouquet Exercices','Exercices', 'Edition Vidéos', 'Logs', 'Dashboard', 'Administration', 'Entrainements'];
  roles: string[] = ['Club Gold', 'Club Silver', 'Club', 'Staff Gold', 'Staff Silver', 'Staff','Joueur Gold','Joueur Silver', 'Joeur'];
  firstName = new FormControl('', [ Validators.required ]);
  familyName = new FormControl('', [ Validators.required ]);
  email = new FormControl('', [ Validators.required ]);
  phone = new FormControl('', [ Validators.required ]);
  address = new FormControl('', [ Validators.required ]);
  zip = new FormControl('', [ Validators.required ]);
  city = new FormControl('', [ Validators.required ]);
  comment= new FormControl('');
  selectedFile!: File;
  birthdate:any='';
  simpleBirthdate:any='';
  audience:string='public';
  rightsUser:any[]=[];
  roleUser='';
  update = false;
  selectedRights:any[]=[];
  selectedRole='';
  urlImg:any;
  eventImageFile:any;
  uploadedImages:any;
  licences = new FormControl('10', [ Validators.required ]);

  constructor(
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    public dialog: MatDialog,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogCreateCustomer>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
   console.log('LES DATAS MODALS ',this.data, this.data.personalinfos)
   if(this.data !== null){
      this.update = true;
      this.firstName.setValue(this.data.firstName);
      this.familyName.setValue(this.data.personalInfos.familyName);
      this.email.setValue(this.data.email);
      this.phone.setValue(this.data.personalInfos.phone);
      this.address.setValue(this.data.personalInfos.address);
      this.zip.setValue(this.data.personalInfos.zip);
      this.city.setValue(this.data.personalInfos.city);
      this.comment.setValue(this.data.personalInfos.comment);
      this.selectedRights =  this.data.privileges.rights;
      this.simpleBirthdate = this.data.personalInfos.simpleBirthdate;
      this.selectedRole = this.data.privileges.role;
      this.licences.setValue(this.data.licencied);
      console.log( 'SELECTED RIGHTS :! ',this.data, this.selectedRights)
    }
  }

  dateChange(event:any){
    this.birthdate = event.value;
    this.simpleBirthdate = event.targetElement.value;
  }

  closeModal(){
    this.rightsUser = this.selectedRights;
    this.roleUser =  this.selectedRole;
    let data = {
      avatarImages: this.eventImageFile,
      firstName: this.firstName.value,
      familyName: this.familyName.value,
      email: this.email.value,
      phone:this.phone.value,
      address:this.address.value,
      zip:this.zip.value,
      city:this.city.value,
      comment:this.comment.value,
      rights: this.rightsUser, 
      birthdate:this.birthdate,
      simpleBirthdate: this.simpleBirthdate, 
      role:this.roleUser, 
      licences:this.licences.value,
      asAdmin:false
    }
    if(this.update === false){
      this.userHandlersServiceCustomer.addAccountCustomer(data);
    }else{
      console.log('SELECTED RIGHTS : ',this.selectedRights,this.rightsUser)
      this.fireStoreServiceImages.addImagesOfCustomers(this.data.id, this.eventImageFile);
      this.userHandlersServiceCustomer.updateAccountCustomer(this.data.id, data);
    }

    setTimeout(() => {
      let passWord = 'Drilllight2023';
      this.dialogRef.close(data);
      if(this.email.value !== null ){
        if(this.update === false){
          this.update = false;
        this.afAuth.createUserWithEmailAndPassword(this.email.value, passWord).then((result) => {
          console.log('You have been successfully registered!',result.user);
          this.storageServiceMail.addMailCustomer(this.email.value, this.firstName.value)
        }).catch((error) => {
          window.alert(error.message);
        });
      }
      }
      console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord)

    }, 700);
  }

  selectChangeRights(event:any){
    console.log(event.value);
    this.rightsUser = event.value;
  }

  onFileChanged(event:any) {
    this.eventImageFile = [];
    this.eventImageFile = event;
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    this.urlImg = [];
    // upload code goes here
    console.log('SELECTED FILE :: ',this.selectedFile)
    let reader = new FileReader();
    if(this.selectedFile !==  undefined) {
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.urlImg = reader.result;
      };
    }
  }

  confirmModeration(){
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data:this.data,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('RESULT OF MODERATION CUSTOMER :',result, this.data)
      this.data.moderation = result;
      this.data.data.moderate.moderatereason.moderate = result;
      const dialogRef = this.dialog.open(DialogCreateCustomer, {
        data:this.data,
        panelClass: 'bg-color',
        width:'80%'
      });
      console.log(result)
    });
  }

  selectChangeRole(event:any){
    console.log(event.value);
    this.roleUser = event.value;
  }

  matcher = new MyErrorStateMatcher();
}

@Component({
  selector: 'dialog-delete-user',
  templateUrl: './dialog/dialog-delete-user.html',
  styleUrls: ['./administration.component.scss'],
  standalone: true,
  imports: [ MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogDeleteUser implements OnInit{
  nameuser = new FormControl('', [ Validators.required ]);
  firstnameuser = new FormControl('', [ Validators.required ]);
  emailuser = new FormControl('', [ Validators.required ]);
  commenter= new FormControl('', [ Validators.required ]);
  selectedModerateReasons :any[]=[];
  moderatesReasons:any[] = ['retard paiement', 'désabonement', 'fin de contrat', 'banisssement', 'non respect des closes', 'désabonement'];
  selectedFile!: File;
  update=false;
  isDisabled: any;
  isChecked = false;
  isModerate = 'non';
  constructor(
    private utilsService:UtilsService,
    private  administrationComponent:AdministrationComponent,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogCreateCustomer>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {

  }

  ngOnInit(): void {
   console.log('LES DATAS MODALS MODERATE',this.data)
   if(this.data !== null){
    if(this.data.trained !== null){
      this.update = true;
      this.nameuser.setValue(this.data.trained.name);
      this.firstnameuser.setValue(this.data.trained.firstname);
      this.emailuser.setValue(this.data.trained.email);
      if(this.data.trained.moderate !== undefined){
        this.isChecked = true;
        this.isModerate = 'oui';
        this.commenter.setValue(this.data.trained.moderate.moderatereason.comment)
        this.selectedModerateReasons = this.data.trained.moderate.moderatereason.moderateby
      }
    }else{
      if(this.data.data !== null || this.data.data !== undefined){
        if(this.data.data.moderate !== null || this.data.data.moderate !== undefined){
          if(this.data.data.moderate.moderatereason.moderate === true){
            this.isChecked = true;
            this.isModerate = 'oui';
            console.log('LE COMMENTAIRE :: !',this.data.data.moderate.moderatereason.comment)
            this.commenter.setValue(this.data.data.moderate.moderatereason.comment)
            this.selectedModerateReasons = this.data.data.moderate.moderatereason.moderateby
           }
        }
        this.update = true;
        this.nameuser.setValue(this.data.data.personalinfos.name);
        this.firstnameuser.setValue(this.data.data.personalinfos.firstname);
        this.emailuser.setValue(this.data.data.personalinfos.email);
        }else{
          console.log('Deuxieme cas STAFFS ET UTILISATEURS: !: ')
        }
      }
    }
  }

  selectChange(event:any){
    this.selectedModerateReasons = event.value;
  }

  changeModeration(){
    console.log(this.isChecked)
    if(this.isChecked === false){
      this.isModerate = 'non';
    }else{
      this.isModerate = 'oui';
    }
  }

  moderateUser(){
    let data = {moderate: this.isChecked, moderateby:this.selectedModerateReasons,comment:this.commenter.value }
    console.log('LES DATAS AVANT DE MODERER UN USER :',data)
    if(this.data.trained !== null){
      // User part
      // Verif if changeModerateOption
      // this.utilsService.changeModerateOption({data:data, account:this.data});
      this.userHandlersServiceCustomer.moderateAccountUser(this.data, data);
      this.utilsService.sendNewDataOfCustomer({data:true});
      setTimeout(() => {
        this.dialogRef.close();
      }, 700);
    }else{
      this.userHandlersServiceCustomer.moderateAccountCustomer(this.data, data);
      setTimeout(() => {
        this.utilsService.changeModerateOption({data:data, account:this.data});
        this.dialogRef.close(this.isChecked);
      }, 700);
    }
  }
}


@Component({
  selector: 'dialog-create-user',
  templateUrl: './dialog/dialog-create-user.html',
  styleUrls: ['./administration.component.scss'],
  standalone: true,
  imports: [ DatePipe, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogCreateUser implements OnInit{
  Disciplines: string[] = ['Foot', 'Athlétisme','Rugby','Fitness', 'Hockey', 'Boxe', 'Danse', 'Tir à l\'arc','autre'];
  Objectifs: string[] = ['Préparation physique', 'Rééducation', 'Améliorations cognitives', 'Déplacements', 'Dextérité', 'Prise d\'informations'];
  Levels: string[] = ['Débutant','Amateur','Professionel'];
  name = new FormControl('', [ Validators.required ]);
  firstname = new FormControl('', [ Validators.required ]);
  email = new FormControl('', [ Validators.required ]);
  phone = new FormControl('', [ Validators.required ]);
  address = new FormControl('', [ Validators.required ]);
  zip = new FormControl('', [ Validators.required ]);
  city = new FormControl('', [ Validators.required ]);
  size = new FormControl('', [ Validators.required ]);
  weight = new FormControl('', [ Validators.required ]);
  comment= new FormControl('');
  selectedFile!: File;
  birthdate:any='';
  simplebirthdate:any='';
  audience:string='public';
  rightsUser:any[]=[];
  roleUser:any[]=[];
  update = false;
  selectedDiscipline:any[]=[];
  selectedObjectifs:any[]=[];
  selectedLevel = '';
  urlImg:any;
  eventImageFile:any ='';
  uploadedImages:any;
  maDate = new Date();
  user:any;
  Manualitys:any[] = ['Droitier','Gaucher'];
  Genders:any[] = ['Homme','Femme', 'Non Précisé'];
  selectedManuality :string = '';
  selectedGender:string = '';
  constructor(
    private utilsService:UtilsService,
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    private datePipe:DatePipe,
    public dialog: MatDialog,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogCreateUser>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
  this.user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log('LES DATAS MODALS USER ::',this.data,  this.user)
  //  console.log('LES DATAS MODALS USER ::', this.data.data.traineds)
  if(this.data !== null){
    if(this.data.trained !== undefined ){
        this.update = true;
        this.name.setValue(this.data.trained.name);
        this.firstname.setValue(this.data.trained.firstname);
        this.email.setValue(this.data.trained.email);
        this.phone.setValue(this.data.trained.phone);
        this.address.setValue(this.data.trained.address);
        this.zip.setValue(this.data.trained.zip);
        this.city.setValue(this.data.trained.city);
        this.comment.setValue(this.data.trained.comment);
        this.size.setValue(this.data.trained.size);
        this.weight.setValue(this.data.trained.weight);
        this.selectedObjectifs =  this.data.trained.objectif;
        this.selectedDiscipline =  this.data.trained.discipline;
        this.selectedLevel =  this.data.trained.level;
        this.selectedManuality =  this.data.trained.manuality;
        this.selectedGender =  this.data.trained.gender;

      }
    }
  }

  selectChangeLevel(event:any){
    this.selectedLevel = event.value;
  }

  selectChangeDiscipline(event:any){
    this.selectedDiscipline = event.value;
  }

  selectChangeObjectifs(event:any){
    this.selectedObjectifs = event.value;
  }

  selectChangeManuality(event:any){
    this.selectedManuality = event.value;
  }

  selectChangeGender(event:any){
    this.selectedGender = event.value;
  }

  onFileChanged(event:any) {
    this.eventImageFile = [];
    this.eventImageFile = event;
    this.selectedFile = event.target.files[0];
  }

  chooseAvatar(value:string){
    console.log('avatar',value)
  }

  onUpload() {
    this.urlImg = [];
    // upload code goes here
    console.log('SELECTED FILE :: ',this.selectedFile)
    let reader = new FileReader();
    if(this.selectedFile !==  undefined) {
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.urlImg = reader.result;
      };
    }
  }

  dateChange(event:any){
    this.birthdate = event.value;
    this.simplebirthdate = event.targetElement.value;
  }

  selectChange(event:any){
    console.log(event.value);
  }

  closeModal(){
      console.log(this.name.value,
      this.firstname.value,
      this.email.value,
      this.phone.value,
      this.address.value,
      this.zip.value,
      this.city.value,
      this.size.value,
      this.weight.value,
      this.comment.value,
      this.birthdate,
      this.simplebirthdate,
      this.selectedDiscipline,
      this.selectedObjectifs,
      this.selectedLevel,
      this.selectedManuality,
      this.selectedGender

      )

    if(this.update === false){
          console.log('on crée')
          let uuid = '';
          uuid = uid(32);
          let dataForm = {traineds: {uuid:uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
            objectif:this.selectedObjectifs,size:this.size.value,weight:this.weight.value, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,level:this.selectedLevel,
            gender:this.selectedGender,manuality:this.selectedManuality,
            date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
            dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')
          } }
          this.userHandlersServiceCustomer.addAccountTrained(this.data, dataForm)

      }else{
      console.log('RREAL UPDATE : ',this.data)
      let dataForm = {traineds: {uuid:this.data.trained.uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
        objectif:this.selectedObjectifs,size:this.size.value,weight:this.weight.value, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,level:this.selectedLevel,
        gender:this.selectedGender,manuality:this.selectedManuality,
        date:this.data.trained.date,
        update: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
      }}
        console.log('SELECTED RIGHTS : ',dataForm)
        // this.fireStoreServiceImages.addImagesOfTrained(this.data.id, this.eventImageFile);
        this.userHandlersServiceCustomer.updateAccountTrained(this.data, dataForm);
    }
    setTimeout(() => {
      this.dialogRef.close();
      console.log('on email user aout', this.update, this.data.email)
      let passWord = 'Drilllight2023';
      if(this.email.value !== null ){
        if(this.update === false){
          this.afAuth.createUserWithEmailAndPassword(this.email.value, passWord).then((result) => {
            // window.alert('You have been successfully registered!');
            console.log('You have been successfully registered!',result.user);
            this.storageServiceMail.addMailTrained(this.email.value, this.name.value)
          })
          .catch((error) => {
            window.alert(error.message);
          });
          this.userHandlersServiceAdmin.getAccountWithEmail(this.user.email).subscribe((dataAccount:any) =>{
            console.log('WE GONE SAVE THIS DATA : ! ',dataAccount.docs[0].data())
            //localStorage.setItem('account', JSON.stringify(dataAccount.docs[0].data()));
            this.utilsService.sendNewDataOfCustomer({data:true})
          });
        }else{
          // this.storageServiceMail.updateAccountTrained(this.email.value, this.name.value)
        }
      }
      console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord);
    }, 700);
    }

  confirmModeration(){
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data:this.data,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('RESULT OF MODERATION USER :',result, this.data)
      this.data.moderate = result;
      this.data.data.moderate.moderatereason.moderate = result;
      const dialogRef = this.dialog.open(DialogCreateUser, {
        data:this.data,
        panelClass: 'bg-color',
        width:'80%'
      });
      console.log(result)
      console.log('RESULT OF MODERATION :',result)
    });
  }

  deleteUser(){
    // history Story
    let data = {comment:this.comment.value }

  }
}




@Component({
  selector: 'dialog-create-staff',
  templateUrl: './dialog/dialog-create-staff.html',
  styleUrls: ['./administration.component.scss'],
  standalone: true,
  imports: [ DatePipe, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogCreateStaff implements OnInit{
  Disciplines: string[] = ['Foot', 'Athlétisme','Rugby','Fitness', 'Hockey', 'Boxe', 'Danse', 'Tir à l\'arc','autre'];
  Roles: string[] = ['Préparation physique', 'Rééducation', 'Améliorations cognitives', 'Déplacements', 'Dextérité', 'Prise d\'informations'];
  Levels: string[] = ['Débutant','Amateur','Professionel'];
  name = new FormControl('', [ Validators.required ]);
  firstname = new FormControl('', [ Validators.required ]);
  email = new FormControl('', [ Validators.required ]);
  phone = new FormControl('', [ Validators.required ]);
  address = new FormControl('', [ Validators.required ]);
  zip = new FormControl('', [ Validators.required ]);
  city = new FormControl('', [ Validators.required ]);
  comment= new FormControl('');
  selectedFile!: File;
  birthdate:any='';
  simplebirthdate:any='';
  audience:string='public';
  rightsUser:any[]=[];
  roleUser:any[]=[];
  update = false;
  selectedDiscipline:any[]=[];
  selectedRole:any[]=[];
  selectedTraineds:any[any]=[];
  selectedLevel = '';
  urlImg:any;
  eventImageFile:any ='';
  uploadedImages:any;
  maDate = new Date();
  traineds:any[]=[];
  user:any;

  constructor(
    private utilsService:UtilsService,
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    private datePipe:DatePipe,
    public dialog: MatDialog,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogCreateStaff>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('LES DATAS MODALS STAFF ::',this.data);
    if(this.data.trained !== undefined){
        if(this.data.ProfilAccount.traineds !== undefined){
          // this.selectedTraineds = this.data.trained.traineds;
          this.traineds = this.data.ProfilAccount.traineds;
          this.update = true;
          // this.data.ProfilAccount.traineds.forEach((trained:any) => {
          //   this.selectedTraineds.push(trained.name+ ' '+ trained.firstname )
          // });
        }
        console.log("LES DATAS TRAINEDS :: ",this.selectedTraineds);
        this.name.setValue(this.data.trained.name);
        this.firstname.setValue(this.data.trained.firstname);
        this.email.setValue(this.data.trained.email);
        this.phone.setValue(this.data.trained.phone);
        this.address.setValue(this.data.trained.address);
        this.zip.setValue(this.data.trained.zip);
        this.city.setValue(this.data.trained.city);
        this.comment.setValue(this.data.trained.comment);
        this.selectedRole =  this.data.trained.roles;
        this.selectedLevel = this.data.trained.level;
        this.selectedDiscipline =  this.data.trained.discipline;
        console.log('DISCIPLINE : ',this.selectedDiscipline)
    }else{
      console.log('LES DATAS POUR LE CREATE DU STAFF ! ',this.data)
      // if(this.data.data.traineds !== undefined || this.data.data.traineds.length >0){
      //   this.traineds = this.data.data.traineds;
      //   console.log('LES ENTRAINES :: !', this.traineds)
      // }
      if(this.data.traineds !== undefined || this.data.traineds.length >0){
        this.traineds = this.data.traineds;
        console.log('LES ENTRAINES :: !', this.traineds)
      }
    }
  }

  selectChangeLevel(event:any){
    this.selectedLevel = event.value;
  }

  selectChangeDiscipline(event:any){
    this.selectedDiscipline = event.value;
  }

  selectChangeRole(event:any){
    this.selectedRole = event.value;
  }

  chooseAvatar(avatar:string){
    console.log('Le avatar :',avatar)
  }

  chooseTrained(trained:any){
    if(trained.selected !== undefined){
      if(trained.selected == true ){
        this.selectedTraineds.forEach( (item:any, index:number) => {
          if(item.uuid === trained.uuid) this.selectedTraineds.splice(index,1);
        });
        trained.selected = false;
      }else{
        trained.selected = true;
        this.selectedTraineds.push(trained);
        console.log('CHOIX DE L\'entrainé',trained)
      }
    }else{
        trained.selected = true;
        this.selectedTraineds.push(trained);
        console.log('CHOIX DE L\'entrainé',trained)
    }

    console.log('CHOIX DE L\'entrainé',this.selectedTraineds)
  }


  onFileChanged(event:any) {
    this.eventImageFile = [];
    this.eventImageFile = event;
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    this.urlImg = [];
    // upload code goes here
    console.log('SELECTED FILE :: ',this.selectedFile)
    let reader = new FileReader();
    if(this.selectedFile !==  undefined) {
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.urlImg = reader.result;
      };
    }
  }

  dateChange(event:any){
    this.birthdate = event.value;
    this.simplebirthdate = event.targetElement.value;
  }

  selectChange(event:any){
    console.log(event.value);
  }

  closeModal(){

    console.log(this.name.value,
      this.firstname.value,
      this.email.value,
      this.phone.value,
      this.address.value,
      this.zip.value,
      this.city.value,
      this.comment.value,
      this.birthdate,
      this.simplebirthdate,
      this.selectedDiscipline,
      this.selectedRole,
      this.selectedLevel,
      this.selectedTraineds
      )



    if(this.update === false){
          console.log('on crée')
          let uuid = '';
          uuid = uid(32);
          let dataForm = {staff: {uuid:uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
            level:this.selectedLevel,roles:this.selectedRole, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,
            traineds:this.selectedTraineds,
            date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
            dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')

          } }
          console.log('STAFF : ! ',dataForm)
          this.userHandlersServiceCustomer.addAccountStaff(this.data, dataForm)

      }else{
      console.log('RREAL UPDATE : ',this.data)
      let dataForm = {traineds: {uuid:this.data.trained.uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
        level:this.selectedLevel,roles:this.selectedRole, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,
        traineds:this.selectedTraineds,
        date:this.data.trained.date,
        update: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
      }}
        console.log('SELECTED RIGHTS : ',dataForm)
        // this.fireStoreServiceImages.addImagesOfTrained(this.data.id, this.eventImageFile);
        this.userHandlersServiceCustomer.updateAccountStaff(this.data, dataForm);

    }
    setTimeout(() => {
      this.dialogRef.close();
      this.userHandlersServiceAdmin.getAccountWithEmail(this.user.email).subscribe((dataAccount:any) =>{
        console.log('WE GONE SAVE THIS DATA : ! ',dataAccount.docs[0].data())
        //localStorage.setItem('account', JSON.stringify(dataAccount.docs[0].data()));
        this.utilsService.sendNewDataOfCustomer({data:true})
      });
      console.log('on email user aout', this.update)
      let passWord = 'Drilllight2023';
      if(this.email.value !== null ){
        if(this.update === false){
          // this.afAuth.createUserWithEmailAndPassword(this.email.value, passWord).then((result) => {
          //   // window.alert('You have been successfully registered!');
          //   console.log('You have been successfully registered!',result.user);
          //   this.storageServiceMail.addMailTrained(this.email.value, this.name.value)
          // })
          // .catch((error) => {
          //   window.alert(error.message);
          // });
        }else{
          // this.storageServiceMail.updateAccountTrained(this.email.value, this.name.value)
        }
      }
      console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord)

    }, 700);
    }

  confirmModeration(){
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      data:this.data,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('RESULT OF MODERATION :',result)
    });
  }

  deleteUser(){
    // history Story
    let data = {comment:this.comment.value }

  }
}
