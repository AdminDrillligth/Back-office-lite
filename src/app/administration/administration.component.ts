import { Injectable, Component, OnInit, Inject, ViewChild, inject,EventEmitter,Input,AfterViewInit,Output } from '@angular/core';
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
import { MatAccordion } from '@angular/material/expansion';
import { FirmWareService } from '../../services/firmware.service';
import { MatRadioModule } from '@angular/material/radio';
import ImageResize from 'image-resize';
import {Location, Appearance } from '@angular-material-extensions/google-maps-autocomplete';
declare var google;
import PlaceResult = google.maps.places.PlaceResult;

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
  role:string,
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
  role:string,
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

  disabledSpinner = false;
  // public appearance = Appearance;
  // public zoom: number;
  // public latitude: number;
  // public longitude: number;
  public selectedAddress: PlaceResult;
  // AutoComplete Select for Adress Google Maps
  // @Input() adressType: string;
  // @Output() setAddress: EventEmitter<any> = new EventEmitter();
  // @ViewChild('addresstext') addresstext: any;
  // autocompleteInput: string;
  // queryWait: boolean;

  panelOpenState = false;
  // ,'date'
  displayedColumnsAccounts: string[] = ['firstName',  'moderation', 'actions'];
  dataSourceAccounts!: MatTableDataSource<any>;
  resultsLength = 0;
  @ViewChild('paginatorAccounts')
  paginatorAccounts!: MatPaginator;

  displayedColumnsProfilAccount: string[] = ['firstName', 'role', 'licences', 'date', 'actions', 'moderation'];
  dataSourceProfilAccount!: MatTableDataSource<any>;

  displayedColumnsOfChoosenAccount : string[] = ['firstName',  'moderation', 'actions'];
  dataSourceUserOfChoosenAccount!: MatTableDataSource<any>;
  resultsLengthUsersAccounts = 0;
  @ViewChild('paginatorUsersAccounts')
  paginatorUsersAccounts!: MatPaginator;


  displayedColumnsStaffOfChoosenAccount : string[] = ['firstName',  'moderation', 'actions'];
  dataSourceStaffOfChoosenAccount!: MatTableDataSource<any>;
  resultsLengthStaffAccounts = 0;
  @ViewChild('paginatorStaffAccounts')
  paginatorStaffAccounts!: MatPaginator;

  seeAsOwner = false;
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

  roles = [
    {name:'Admin', value:'admin'},
    {name:'Owner', value:'owner'},
    // {name:'Staff', value:'staff'},
    // {name:'User', value:'user'},
  ]

  rolesUsers = [
    {name:'Staff', value:'staff'},
    {name:'User', value:'user'},
    // {name:'Staff', value:'staff'},
    // {name:'User', value:'user'},
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
  public displayModalAction:boolean = false;
  public displayModalActionOwner:boolean = false;
  public displayModalFirmware:boolean = false;
  public privateExerciceOnly = false;
  public moderationAccount = false;
  public firmWareList:any = [];
  public privateFirmwareId = false;
  public globalFirmwareId = false;




  // TABLE INIT
  AccountOfUser:any=[];

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('paginatorProfilAccount')
  paginatorProfilAccount!: MatPaginator;
  namer = new FormControl('');
  email = new FormControl('');

  widthScreenMobile:boolean = false;
  constructor(
    private firmWareService:FirmWareService,
    private stripeServices:StripeServices,
    private _snackBar: MatSnackBar,
    private utilsService: UtilsService,
    private afAuth: AngularFireAuth,
    private storageServiceMail:storageServiceMail,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
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
    this.disabledSpinner = true;
    var widthScreen = window.innerWidth;
    if(widthScreen < 600){
      this.widthScreenMobile = true;
      this.displayedColumnsAccounts = ['firstName','actions'];

    }
    // console.log('Le width du screen : !',widthScreen)
    this.userHandlersServiceCustomer.getUpdateallUsers();
    this.utilsService._templateOptions.subscribe((theme:any) => {
      // console.log('THEME !: ',theme)
    });
    this.utilsService._seeAsAdmin.subscribe((asAdmin:any) => {
      console.log('admin see as admin : ', asAdmin)
      if(asAdmin == false){
        this.ownerAccountOf = undefined;
        this.comeBackToOwner = false;
        this.disabledSpinner = true;
        this.letsee = false;
        this.ProfilAccount = undefined;
        this.userHandlersServiceCustomer.getUpdateallUsers();
        this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
        if(this.AccountOfUser.role === 'admin'){
          let allAccounts = JSON.parse(localStorage.getItem('accounts-data') || '{}');
          this.Accounts.length = 0
          allAccounts.forEach((account:any)=>{
            if(account.role === 'admin' || account.role === 'owner'){
              this.Accounts.push(account)
            }
          });
          setTimeout(() => {
            this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
            this.dataSourceAccounts.paginator = this.paginatorAccounts;
            this.resultsLength = this.Accounts.length;
            this.disabledSpinner = false;
          }, 1000);
        }
      }
      if(asAdmin == true){

        setTimeout(() => {
          this.letsee = true;
          // console.log('WE COME BACK WITH THIS ACCOUNT SEE ADMIN  === TRUE : ! ',this.ProfilAccount)
        let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');

        // console.log('profil complet userDetailAccount ON PASSE ADMIN TRUE:',userDetailAccount)
        this.ProfilAccount = userDetailAccount
        this.userHandlersServiceCustomer.getAccountDetails(this.ProfilAccount.id).then((resp:any)=>{
          resp.subscribe((e:any) =>{
            // console.log('LA RESP DU ACCOUNT DETAILS: DANS ADMIN TRUE ',e.account)
            this.ProfilAccount = e.account;
        // users
        if(this.ProfilAccount.users.length > 0 ){
          this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.users);
          this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
          this.resultsLengthUsersAccounts = this.ProfilAccount.users.length;
        }
        if(this.ProfilAccount.staff.length > 0 ){
        // staff

        this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.staff);
        this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
        this.resultsLengthStaffAccounts = this.ProfilAccount.staff.length;
        }



          })
        });
        }, 1000);

      }
    })
    this.firmWareService.getFirmwareList().then((firmwareList:any)=>{
      // console.log('list of firwares: ',firmwareList)
      firmwareList.subscribe((list:any)=>{
        // console.log('list of firwares: ',list.firmwareList)
        this.firmWareList = list.firmwareList;
        this.firmWareList = this.firmWareList.sort((a, b) => {
          if (a.version > b.version) {
              return -1;
          }
          if (a.version < b.version) {
              return 1;
          }
          return 0;
        });
        this.firmWareList.forEach((firmware:any)=>{
          firmware.date = new Date(firmware.creationDate).toLocaleDateString('en-GB')
        })

      })
    });
    this.utilsService._newaccount.subscribe((update:any) =>{
       if(update !== null){
         if(update == true){
          this.Accounts = [];
          let allAccounts = JSON.parse(localStorage.getItem('accounts-data') || '{}');
          // console.log('ICI all accounts :: ',allAccounts)
          // console.log('ICI ADMIN NEW ACCOUNT :: ',this.AccountOfUser)
          this.Accounts.length = 0
          allAccounts.forEach((account:any)=>{
            if(account.role === 'admin' || account.role === 'owner'){
              this.Accounts.push(account)
            }
          });
          this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
          this.dataSourceAccounts.paginator = this.paginatorAccounts;
          this.resultsLength = this.Accounts.length;
          this._snackBar.openFromComponent(snackComponent, { duration:  1000,});
          //  this.letsee = true;
          //  this.ProfilAccount = {data: this.AccountOfUser};
        }
      }
    })

    this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    // console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
    if(this.AccountOfUser.role === 'admin'){
      let allAccounts = JSON.parse(localStorage.getItem('accounts-data') || '{}');
      this.Accounts.length = 0
      allAccounts.forEach((account:any)=>{
        if(account.role === 'admin' || account.role === 'owner'){
          this.Accounts.push(account)
        }
      });
      setTimeout(() => {
        this.dataSourceAccounts = new MatTableDataSource(this.Accounts);
        this.dataSourceAccounts.paginator = this.paginatorAccounts;
        this.resultsLength = this.Accounts.length;
        this.disabledSpinner = false;
      }, 1000);
    }
    if(this.AccountOfUser.role === 'owner'){
      this.seeAsOwner = true;
      this.ProfilAccount = this.AccountOfUser;
      this.disabledSpinner = false;
      // console.log('DETAILS ACCOUNT : !',this.ProfilAccount)
      this.userHandlersServiceCustomer.getAccountDetails(this.ProfilAccount.id).then((resp:any)=>{
        resp.subscribe((e:any) =>{
          // console.log('LA RESP DU ACCOUNT DETAILS: ',e.account)
        })
      });
    }
    if(this.AccountOfUser.role === 'staff'){
      // this.letsee = true;
      this.seeAsOwner = true;
      this.ProfilAccount = this.AccountOfUser;
      this.disabledSpinner = false;


      let allAccounts = JSON.parse(localStorage.getItem('accounts-data') || '{}');
      console.log('TOUS LES COMPTES : !',allAccounts)
      allAccounts.forEach((account:any)=>{
        console.log(account)
        if(account.role === 'staff' || account.role === 'owner'){
          this.parseStaff.push(account)
        }else{
          this.parseUsers.push(account)
        }
      })
      if(this.parseStaff.length > 0){
        // staff

        this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.parseStaff);
        this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
        this.resultsLengthStaffAccounts = this.parseStaff.length;
      }
              // users
      if(this.parseUsers.length > 0 ){
        this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.parseUsers);
        this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
        this.resultsLengthUsersAccounts = this.parseUsers.length;
      }
      // console.log('Notre tableau ParseStaff :  : ! ',this.parseStaff)
      // this.getDetails(this.ProfilAccount.owner)

    }
  }
  parseStaff = [];
  parseUsers = [];


  // ICI ON GET LES DETAILS D'UN COMPTE EN PARTICULIER : => UN COMPTE SELECTIONNE
  getDetails(accountOwner:any){
    // console.log("TEST OWNER TO GET THE NEW DATA",accountOwner)
    this.userHandlersServiceCustomer.getAccountDetails(accountOwner).then((resp:any)=>{
      resp.subscribe((e:any) =>{
        // console.log('LA RESP DU GET AFTER UPDATE DETAILS: ',e.account)
        localStorage.setItem('account-data-user', JSON.stringify(e.account));

        this.ProfilAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
        if(this.ProfilAccount.users.length > 0){
        // users
        this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.users);
        this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
        this.resultsLengthUsersAccounts = this.ProfilAccount.users.length;
        }

        if(this.ProfilAccount.staff.length > 0){
        // staff

        this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.staff);
        this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
        this.resultsLengthStaffAccounts = this.ProfilAccount.staff.length;
        }

      })
    });
  }

  // CHARTS LINE UP
  onSelect(data:any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  // CREATE ADMIN !!
  createAdmin(){
    const dialogRef = this.dialog.open(DialogCreateAdmin, {
      panelClass: 'bg-color',
      width:'80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.userHandlersServiceCustomer.getUpdateallUsers();
      // this.getAdminCustomerUsers();
    });
  }

  //chargeZip
  srCzip:any="";
  global=false;
  private=false;

  uploadZip(){

  }

  displayModalUpdateDataProfil = false;
  familyName = new FormControl(''); //
  firstName = new FormControl(''); //
  userEmail = new FormControl(''); //
  phone = new FormControl(''); //
  address1 :any= "";
  address2 = new FormControl('');
  zip :any= "";
  city :any= "";
  region :any = "";
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
  dataBase64 = "";


  onAutocompleteSelected(result: PlaceResult) {
    // console.log('onAutocompleteSelected: ', result.address_components);
    this.region = result.address_components[5].long_name;
    this.city = result.address_components[2].long_name;
    this.zip =  result.address_components[6].long_name;
    this.address1 = result.address_components[0].long_name + ' ' + result.address_components[1].long_name;
  }



  updateProfilDatas(ProfilAccount:any){
    this.urlImg = undefined;
    // console.log('PROFILE TO UPDATE :   ! ',ProfilAccount)
    this.displayModalUpdateDataProfil = true;
    this.update = true;
    if(ProfilAccount !== undefined){
      this.familyName.setValue(ProfilAccount.familyName);
      this.firstName.setValue(ProfilAccount.firstName);
      this.phone.setValue(ProfilAccount.personalInfo.phone);
      this.userEmail.setValue(ProfilAccount.email);
      this.address1 = ProfilAccount.personalInfo.address1;
      this.address2.setValue(ProfilAccount.personalInfo.address2);
      this.zip = ProfilAccount.personalInfo.zip;
      this.city = ProfilAccount.personalInfo.city;
      this.region = ProfilAccount.personalInfo.region;
      this.urlImg = ProfilAccount.avatarURL;


    }
  }


  wrongMail = true;
  updateEmail(){
    // test REGEX MAIL
    const re = /\S+@\S+\.\S+/;
    console.log(re.test(this.userEmail.value));
    if(!re.test(this.userEmail.value)){ this.wrongMail = false; }else{ this.wrongMail = true; }
  }

  wrongPhone = true;
  updatePhone(){
    const re = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
    console.log(re.test(this.phone.value));
    if(!re.test(this.phone.value)){ this.wrongPhone = false; }else{ this.wrongPhone = true; }
  }


  updateProfilSender(ProfilAccount:any){
    if(this.wrongMail && this.wrongPhone){
      ProfilAccount.familyName = this.familyName.value;
      ProfilAccount.firstName = this.firstName.value;
      ProfilAccount.personalInfo.phone = this.phone.value;
      ProfilAccount.email = this.userEmail.value;
      ProfilAccount.personalInfo.address1 = this.address1;
      ProfilAccount.personalInfo.zip = this.zip;
      ProfilAccount.personalInfo.city = this.city;
      ProfilAccount.personalInfo.region = this.region;

      ProfilAccount.avatarURL = this.urlImg;
      console.log('LES NOUVELLES DATAS DU ACCOUNT : ',ProfilAccount, this.dataBase64)
      this.userHandlersServiceCustomer.updateAccount(ProfilAccount).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          console.log('la resp du update user: ! ', response.account)
          // console.log(this.)
          this.displayModalUpdateDataProfil = false;
          if(response.account.role !== 'staff' || response.account.role !== 'user'){
            this.getDetails(response.account.id);
          }else{
            this.getDetails(response.account.id);
            this.userHandlersServiceCustomer.getAccounts().subscribe((accounts:any)=>{
              this.parseStaff = [];
              this.parseUsers = [];
              console.log('On subscribe: ',accounts.accounts)
              localStorage.setItem('accounts-data', JSON.stringify(accounts.accounts));
              // console.log('LIST DES USERS : ! ', response)
              accounts.accounts.forEach((account:any)=>{
                console.log(account)
                if(account.role === 'staff' || account.role === 'owner'){
                  this.parseStaff.push(account)
                }else{
                  this.parseUsers.push(account)
                }
              })
              if(this.parseStaff.length > 0){
                // staff
        
                this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.parseStaff);
                this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
                this.resultsLengthStaffAccounts = this.parseStaff.length;
              }
                      // users
              if(this.parseUsers.length > 0 ){
                this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.parseUsers);
                this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
                this.resultsLengthUsersAccounts = this.parseUsers.length;
              }
            });
          }
          
          // localStorage.setItem('account-data-user', JSON.stringify(e.account));

          // this.ProfilAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
          // localStorage.setItem('account', JSON.stringify(response.account));
          // this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
          // this.getDetails(this.modalAccount.id);
        })
      });
    }
  }

  urlImg :any= undefined;
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
      this.urlImg = this.dataBase64
    });
  }

  closeModalUpdateProfil(){
    this.displayModalUpdateDataProfil = false;
  }

  modalAccount:any;
  displayButtonSeeAccount = false;
  openModalActions(account:any){
    this.displayButtonSeeAccount = false;
    // console.log('ON CHOOS E CE ACCOUNT : ! ',account)
    this.userHandlersServiceCustomer.getAccountDetails(account.id).then((resp:any)=>{
      resp.subscribe((e:any) =>{
        // console.log('LA RESP DU ACCOUNT DETAILS: ',e.account)
        if(e.account !== undefined){
          this.displayButtonSeeAccount = true;
          this.modalAccount = e.account;
          if(this.modalAccount.privateFirmwareId !== undefined){
            if(this.modalAccount.privateFirmwareId !== ""){
              this.privateFirmwareId = true;
            }
          }
          if(this.modalAccount.privateOnly !== undefined){
            this.privateExerciceOnly = this.modalAccount.privateOnly;
          }
          if(this.modalAccount.privateOnly === undefined){
            this.privateExerciceOnly = false;
          }
          if(this.modalAccount.warning !== undefined){
            this.moderationAccount = this.modalAccount.warning;
          }
          if(this.modalAccount.warning === undefined){
            this.moderationAccount = false;
          }
        }

      })
    })
    if(this.firmWareList.length !== 0 ){

    }else{
      this.firmWareService.getFirmwareList().then((firmwareList:any)=>{
        // console.log('list of firwares: ',firmwareList)
        firmwareList.subscribe((list:any)=>{
          // console.log('list of firwares: ',list.firmwareList)
          this.firmWareList = list.firmwareList;
          this.firmWareList = this.firmWareList.sort((a, b) => {
            if (a.version > b.version) {
                return -1;
            }
            if (a.version < b.version) {
                return 1;
            }
            return 0;
          });

          this.firmWareList.forEach((firmware:any)=>{
            firmware.date = new Date(firmware.creationDate).toLocaleDateString('en-GB')
          })


        })
      });
    }
    // console.log('QUEL COMPTE : ! ',this.modalAccount)
    // if(this.modalAccount === undefined){
    //   this.router.navigate(['login']);
    // }
    setTimeout(() => {
      this.displayModalAction = true;
    }, 400);

  }

  modalAccountOwner:any;
  topOfModal = '140px'
  openModalActionsOwner(account:any,event:any){
    // console.log('le event de la mouse : ', event)
    // console.log('le event de la mouse : ', event.layerY)
    // console.log('LE ACCOUNT SELECT  : ! ',account)
    this.topOfModal = event.layerY-200+'px'
    this.modalAccountOwner = account
    this.userHandlersServiceCustomer.getAccountDetails(account.id).then((resp:any)=>{

      resp.subscribe((e:any) =>{
        // console.log('LA RESP DU ACCOUNT DETAILS STAFF OR USER : ',e.account)
        this.modalAccountOwner = e.account;
        // console.log('LE ACCOUNT SELECT : ',this.modalAccountOwner)
        if(this.modalAccountOwner.privateOnly !== undefined){
          this.privateExerciceOnly = this.modalAccountOwner.privateOnly;
        }
        if(this.modalAccountOwner.privateOnly === undefined){
          this.privateExerciceOnly = false;
        }
        if(this.modalAccountOwner.warning !== undefined){
          this.moderationAccount = this.modalAccountOwner.warning;
        }
        if(this.modalAccountOwner.warning === undefined){
          this.moderationAccount = false;
        }

      })

    })
    setTimeout(() => {
      this.displayModalActionOwner = true;
    }, 400);
  }

  // public privateExerciceOnly = false;
  // public moderationAccount = false;
  modarateAccount(account:any){
    this.displayModalAction = false;
    // console.log('QUEL COMPTE : ! ',account)
    if(this.moderationAccount){
      this.moderationAccount = false
    }else{
      this.moderationAccount = true
    }

    account.warning = this.moderationAccount;
    this.userHandlersServiceCustomer.updateAccount(account).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        // console.log('la resp du update user: ! ', response)

      })
    });
    let staffToUpdate:any = [];
    account.staff.forEach((staff:any)=>{
      this.userHandlersServiceCustomer.getAccountDetails(staff.id).then((resp:any)=>{
        resp.subscribe((e:any) =>{
          // console.log('LA RESP DU ACCOUNT DETAILS STAFF OR USER : ',e.account)
          e.account.warning = account.warning;
          staffToUpdate.push(e.account)
          // console.log('STAFF ACCOUNT : !',staffToUpdate)
          if(account.staff.length === staffToUpdate.length){
            // console.log('SAME LENGTH STAFF ACCOUNT : !',staffToUpdate)
            staffToUpdate.forEach((staff:any)=>{
              this.userHandlersServiceCustomer.updateAccount(staff).then((resp:any)=>{
                resp.subscribe((response:any)=>{
                  // console.log('la resp du update Staff Private only: ! ', response)
                })
              });
            })
          }
        })
      })
    })
    let userToUpdate:any = [];
    account.users.forEach((user:any)=>{
      this.userHandlersServiceCustomer.getAccountDetails(user.id).then((resp:any)=>{
        resp.subscribe((e:any) =>{
          // console.log('LA RESP DU ACCOUNT DETAILS STAFF OR USER : ',e.account)
          e.account.warning = account.warning;
          userToUpdate.push(e.account)
          // console.log('STAFF ACCOUNT : !',userToUpdate)
          if(account.users.length === userToUpdate.length){
            // console.log('SAME LENGTH STAFF ACCOUNT : !',userToUpdate)
            userToUpdate.forEach((user:any)=>{
              this.userHandlersServiceCustomer.updateAccount(user).then((resp:any)=>{
                resp.subscribe((response:any)=>{
                  // console.log('la resp du update Staff Private only: ! ', response)
                })
              });
            })
          }
        })
      })
    })



    // console.log('Warning Only ? :',account.warning);
  }

  privateExercice(account:any){
    this.displayModalAction = false;
    if(this.privateExerciceOnly){
      this.privateExerciceOnly = false
    }else{
      this.privateExerciceOnly = true
    }
    account.privateOnly = this.privateExerciceOnly;
    this.userHandlersServiceCustomer.updateAccount(account).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        console.log('la resp du update user: ! ', response)

      })
    });
    let staffToUpdate:any = [];
    account.staff.forEach((staff:any)=>{
      this.userHandlersServiceCustomer.getAccountDetails(staff.id).then((resp:any)=>{
        resp.subscribe((e:any) =>{
          // console.log('LA RESP DU ACCOUNT DETAILS STAFF OR USER : ',e.account)
          e.account.privateOnly = account.privateOnly;
          staffToUpdate.push(e.account)
          console.log('STAFF ACCOUNT : !',staffToUpdate)
          if(account.staff.length === staffToUpdate.length){
            // console.log('SAME LENGTH STAFF ACCOUNT : !',staffToUpdate)
            staffToUpdate.forEach((staff:any)=>{
              this.userHandlersServiceCustomer.updateAccount(staff).then((resp:any)=>{
                resp.subscribe((response:any)=>{
                  // console.log('la resp du update Staff Private only: ! ', response)
                })
              });
            })
          }
        })
      })


    })



    console.log('Private Only ? :',account.privateOnly);
  }


  gradeToRole(account:any, type:string){
    if(type ===  'staff'){
      account.role = 'user';
      this.modalAccount.staff.forEach((staff:any, index:number)=>{
        if(account.id === staff.id){
          // console.log(staff.id,index)
          // console.log(this.modalAccount.staff,this.modalAccount.users)
          this.modalAccount.users.push(account)
          this.modalAccount.staff = this.modalAccount.staff.filter((staff:any) => staff.id !== account.id)
          // console.log(this.modalAccount.staff,this.modalAccount.users)
        }
      })
      console.log(this.modalAccount.staff,this.modalAccount.users)
    }else{
      account.role = 'staff';
      this.modalAccount.users.forEach((user:any, index:number)=>{
        if(account.id === user.id){
          this.modalAccount.staff.push(account)
          this.modalAccount.users = this.modalAccount.users.filter((user:any) => user.id !== account.id)
          // console.log(this.modalAccount.staff,this.modalAccount.users)

          // console.log(user.id,index)
        }
      })
      console.log(this.modalAccount.staff,this.modalAccount.users)
    }
    this.userHandlersServiceCustomer.updateAccount(account).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        console.log('la resp du update user or staff: ! ', response)
        // this.getDetails(account.owner);
      })
    });
    this.userHandlersServiceCustomer.updateAccount(this.modalAccount).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        console.log('la resp du update user or staff: ! ', response)
        this.getDetails(this.modalAccount.id);
      })
    });

  }



  selectedFirmware(firmware:any){
    // console.log('FIRMWARE : ! ',firmware.id,firmware)
    this.selectedVersion = firmware;
  }


  globalFirmwareForThisAccount:any=[];
  privateFirmwareForThisAccount:any=[];

  displayModalOfPrivateFirmware(account:any){
    if(account !== undefined){
      if(account.privateFirmwareId !== undefined){
        // console.log('RESP OF privateFirmwareId : ? ',account.privateFirmwareId)
        if(account.privateFirmwareId !== "" ){
          this.firmWareService.getfirmwareDetails(account.privateFirmwareId).subscribe((element:any)=>{
            console.log('LE PRIVATE  : ',element)
            if(element.response.result === "success"){
                    this.privateFirmwareForThisAccount = element.firmwareDetail;
                    this.privateFirmwareId = true;
                    this.globalFirmwareId = false;
                    console.log('liste des versions : ',this.firmWareList,this.globalFirmwareForThisAccount,  this.privateFirmwareForThisAccount)
                      this.firmWareList.forEach((firmware:any)=>{
                        if(firmware.id === this.privateFirmwareForThisAccount.id){
                          firmware.choosen = true;
                          console.log('LE IDENTIQUE : !',firmware)
                        }else{
                          firmware.choosen = false;
                        }
                      })
            }
          })

        }else{
          this.firmWareService.getGlobalFirmware().subscribe((element:any)=>{
            // console.log('la resp du firmware global : ', element)
              if(element.response.result === "success"){
                this.globalFirmwareForThisAccount = element.globalFirmware;
                this.globalFirmwareId = true;
                this.privateFirmwareId = false;
                console.log('liste des versions : ',this.firmWareList,this.globalFirmwareForThisAccount,  this.privateFirmwareForThisAccount)
                this.firmWareList.forEach((firmware:any)=>{
                  if(firmware.id === this.globalFirmwareForThisAccount.id){
                    firmware.choosen = true;
                    // console.log('LE IDENTIQUE : !',firmware)
                  }else{
                    firmware.choosen = false;
                  }
                })
              }
            })
        }
      }else{
        this.firmWareService.getGlobalFirmware().subscribe((element:any)=>{
          console.log('la resp du firmware global : ', element)
          if(element.response.result === "success"){
            this.globalFirmwareForThisAccount = element.globalFirmware;
            this.globalFirmwareId = true;
            this.privateFirmwareId = false;
            console.log('liste des versions : ',this.firmWareList,this.globalFirmwareForThisAccount,  this.privateFirmwareForThisAccount)
            this.firmWareList.forEach((firmware:any)=>{
              if(firmware.id === this.globalFirmwareForThisAccount.id){
                firmware.choosen = true;
                console.log('LE IDENTIQUE : !',firmware)
              }else{
                firmware.choosen = false;
              }
            })
          }
        })
        this.globalFirmwareId = true;
        this.privateFirmwareId = false;
      }
    }


    // this.firmWareService.getfirmwareDetails("");
    this.displayModalAction = false;
    console.log('QUEL COMPTE : ! ',account)
    if(this.displayModalFirmware){
      this.displayModalFirmware = false
    }else{
      this.displayModalFirmware = true
    }

  }

  selectFirmwareForAccount(account:any){

    console.log(account,this.selectedVersion)
    if(this.selectedVersion !== ""){
      this.displayModalFirmware = false;
      this.displayModalAction = true;
      account.privateFirmwareId = this.selectedVersion.id;
      console.log(this.selectedVersion, account)
      this.userHandlersServiceCustomer.updateAccount(account).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          // console.log('la resp du update user owner: ! ', response)

        })
      });
    }
    //
  }

  removePrivateFirmware(account:any){
    console.log(account)
    account.privateFirmwareId = "";
    this.privateFirmwareId = false;
    this.userHandlersServiceCustomer.updateAccount(account).then((resp:any)=>{
      resp.subscribe((response:any)=>{
        // console.log('la resp du update user owner: ! ', response)
      })
    });

    this.firmWareService.getGlobalFirmware().subscribe((element:any)=>{
      console.log('la resp du firmware global : ', element)
      if(element.response.result === "success"){
        this.globalFirmwareForThisAccount = element.globalFirmware;
        this.globalFirmwareId = true;
        this.privateFirmwareId = false;
        console.log('liste des versions : ',this.firmWareList,this.globalFirmwareForThisAccount)
        this.firmWareList.forEach((firmware:any)=>{
          if(firmware.id === this.globalFirmwareForThisAccount.id){
            firmware.choosen = true;
            // console.log('LE IDENTIQUE : !',firmware)
          }else{
            firmware.choosen = false;
          }
        })
      }
    })
    this.globalFirmwareId = true;
    this.privateFirmwareId = false;
  }

  closeModalAction(){
    this.displayModalAction = false;
    this.displayModalActionOwner = false;
  }

  closeModalFirmware(){
    this.displayModalFirmware = false;
    this.displayModalAction = true;
  }

  selectedVersion:any="";
  gerVersion(event:any){
    console.log(event.target.value)

  }

  selectStatus(event:any){
    console.log('VALEUR DE CHANGEMENTS : ! ',event.value)
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
  accountDetailOfUser:any;
  comeBackToOwner:boolean=false;
  ownerAccountOf = undefined;
  seeAdmin(account:any){
    this.disabledSpinner = true;

    this.displayModalAction = false;
    this.displayModalActionOwner = false;
    // this.ProfilAccount = account;
    console.log('DETAILS ACCOUNT BEFORE: WE SEE ADMIN :::  !',account)
    this.userHandlersServiceCustomer.getAccountDetails(account.id).then((resp:any)=>{
      resp.subscribe((e:any) =>{

        if(e.account.role === "staff" || e.account.role === "user" ){
          this.ownerAccountOf = this.ProfilAccount;
          this.ProfilAccount = e.account;
          this.comeBackToOwner = true;
          console.log('LA RESP DU ACCOUNT DETAILS: ',e.account)
          // console.log('LE OLD PROFIL : ',this.ownerAccountOf)
          // this.ownerAccountOf = e.account.owner;

          if(this.ownerAccountOf.users.length > 0){
            // users

            this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.ownerAccountOf.users);
            this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
            this.resultsLengthUsersAccounts = this.ownerAccountOf.users.length;
          }
          this.disabledSpinner = false;
        }else{

          this.ProfilAccount = e.account;
          localStorage.setItem('account-data-user', JSON.stringify(this.ProfilAccount));
          let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');

          // console.log('profil complet userDetailAccount :',userDetailAccount)
          localStorage.setItem('seeAsAdmin', 'true');
          // if(this.ProfilAccount.users.length > 0 ){
          //   // users
          //   this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.users);
          //   this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
          //   this.resultsLengthUsersAccounts = this.ProfilAccount.users.length;
          // }
          if(this.ProfilAccount.staff.length > 0){
            // staff
            this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.staff);
            this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
            this.resultsLengthStaffAccounts = this.ProfilAccount.staff.length;

          }
          this.disabledSpinner = false;
          this.letsee = true;
          this.utilsService.sendSeeAsAdmin(true);
        }


      })
    });
  }

  selectUserOfStaff(event:any,emp:any){
    // console.log('SELECTIONNER UN NOUVEAU USER POUR LE STAFF : ',this.ProfilAccount,emp, event )
    if(this.ProfilAccount.role === "staff"){
      // console.log('SELECTIONNER UN NOUVEAU USER POUR LE STAFF : ',this.ProfilAccount,emp, event )
      if(event.checked){
        console.log('EVENT CHECKED : ', event.checked )
        this.ProfilAccount.users.push(emp.id)
        console.log("this.ProfilAccount.users", this.ProfilAccount.users)
        this.userHandlersServiceCustomer.updateAccount(this.ProfilAccount).then((resp:any)=>{
          resp.subscribe((response:any)=>{
            console.log('la resp du update user staff: ! ', response)
          })
        });
      }else{
        console.log('EVENT CHECKED : ', event.checked )
        this.ProfilAccount.users =  this.ProfilAccount.users.filter((user:any) => user !== emp.id)
        console.log("this.ProfilAccount.users", this.ProfilAccount.users)
      }
    }
  }


  comeBacktoProfilOwner(){
    this.ProfilAccount = this.ownerAccountOf;
    this.ownerAccountOf = undefined;
    this.getDetails( this.ProfilAccount.id)
    this.comeBackToOwner = false;
  }



  updateUsersOfProfilAccount(){
    console.log('we gone to update datas of users')
    this.userHandlersServiceCustomer.getAccountDetails(this.ProfilAccount.id).then((resp:any)=>{
      resp.subscribe((e:any) =>{
        console.log('LA RESP : ',e.account)
        this.ProfilAccount = e.account;
        // users
        this.ProfilAccount.users.forEach((user:any, index:number)=>{
          console.log('le user: ', user.id, index)
          this.userHandlersServiceCustomer.getAccountDetails(user.id).then((resp:any)=>{
            resp.subscribe((e:any) =>{
              console.log('le detail du user :! ', e.account)
              user = e.account;
              this.ProfilAccount.users[index] = e.account
              console.log(this.ProfilAccount.users)
              this.dataSourceUserOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.users);
              this.dataSourceUserOfChoosenAccount.paginator = this.paginatorAccounts;
              this.resultsLengthUsersAccounts = this.ProfilAccount.users.length;
            })
          })
        })
        // staff
        this.ProfilAccount.staff.forEach((staff:any, index:number)=>{
          console.log('le staff: ', staff.id, index)
          this.userHandlersServiceCustomer.getAccountDetails(staff.id).then((resp:any)=>{
            resp.subscribe((e:any) =>{
              console.log('le detail du staff :! ', e.account)
              staff = e.account;
              this.ProfilAccount.staff[index] = e.account
              console.log(this.ProfilAccount.staff)
              this.dataSourceStaffOfChoosenAccount = new MatTableDataSource(this.ProfilAccount.staff);
              this.dataSourceStaffOfChoosenAccount.paginator = this.paginatorAccounts;
              this.resultsLengthStaffAccounts = this.ProfilAccount.staff.length;
            })
          })
        })
      })
    });
  }


  seeAsUser(ProfilAccount:any){
    console.log('profil complet :',ProfilAccount)
    console.log('profil complet :',this.ProfilAccount)
    localStorage.setItem('account-data-user', JSON.stringify(ProfilAccount));
    let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');

    console.log('profil complet userDetailAccount :',userDetailAccount)
    localStorage.setItem('seeAsAdmin', 'true');
    let seeAsAdmin = JSON.parse(localStorage.getItem('seeAsAdmin') || '{}');
    this.utilsService.sendSeeAsAdmin(true);
    console.log('LE DETAIL DU USER : ! ',userDetailAccount, seeAsAdmin)
    this.router.navigate(['trainings']);

  }


  letSeeAccount:any;
  seeTheSameAdmin(account:any){
    console.log('ON VEUT CE COMPTE :!  ',account)
    // this.utilsService.sendOfCustomerProfilOptions({account:account, seeAs : true});
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
      this.userHandlersServiceCustomer.getUpdateallUsers();
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


  addAccountOfGroup(ProfilAccount:any){
    console.log('Create a user of group!', ProfilAccount);
    const dialogRef = this.dialog.open(DialogCreateUser, {
      data:ProfilAccount,
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.userHandlersServiceCustomer.getUpdateallUsers();
      setTimeout(() => {
        this.updateUsersOfProfilAccount()
      }, 900);
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
      console.log('LE RESULT AFTER ADD A STAFF : !',result)
      this.userHandlersServiceCustomer.getUpdateallUsers();
      setTimeout(() => {
        this.updateUsersOfProfilAccount()
      }, 900);

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
  region = new FormControl('', [ Validators.required ]);
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
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
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
    // let data = {
    //   avatarImages: this.eventImageFile,
    //   firstName:  this.firstName.value,
    //   familyName:this.familyName.value,
    //   email: this.email.value,
    //   phone:this.phone.value,
    //   address:this.address.value,
    //   zip:this.zip.value,
    //   city:this.city.value,
    //   comment:this.comment.value,
    //   rights: this.rightsUser,
    //   birthdate:this.birthdate,
    //   simpleBirthdate: this.simpleBirthdate,
    //   asAdmin:true
    // }
    let data = {
      email: this.email.value,
      passwordHash:"",
      firstName: this.firstName.value,
      familyName: this.familyName.value,
      fullName: this.firstName.value + ' ' +  this.familyName.value,
      avatarURL: "",
      role: "admin",
      personalInfo: {
          birthdate: this.birthdate,
          simpleBirthdate: this.simpleBirthdate,
          address1: this.address.value,
          address2: "",
          zip: this.zip.value,
          city: this.city.value,
          region: this.region.value,
          phone: this.phone.value,
          comment: this.comment.value
      },
      privileges: {
          rights: this.rightsUser
      },
      users: [],
      staff: [],
      econes: [],
      trainings: [],
      videos: [],
      warning: false
    }
    if(this.update === false){
      // this.userHandlersServiceAdmin.addAccountAdmin(data);
      this.userHandlersServiceCustomer.addAccount(data).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          console.log('la resp', response)
        })
      });
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
  region = new FormControl('', [ Validators.required ]);
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
   console.log('LES DATAS MODALS ',this.data, this.data.personalInfos)
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
      email: this.email.value,
      passwordHash:"",
      firstName: this.firstName.value,
      familyName: this.familyName.value,
      fullName: this.firstName.value + ' ' +  this.familyName.value,
      avatarURL: "",
      role: "owner",
      owner:'',
      personalInfo: {
          birthdate: this.birthdate,
          simpleBirthdate: this.simpleBirthdate,
          address1: this.address.value,
          address2: "",
          zip: this.zip.value,
          city: this.city.value,
          region: this.region.value,
          phone: this.phone.value,
          comment: this.comment.value
      },
      privileges: {
          rights: this.rightsUser
      },
      users: [],
      staff: [],
      econes: [],
      trainings: [],
      videos: [],
      licensed: this.licences.value,
      warning: false
    }
    if(this.update === false){
      this.userHandlersServiceCustomer.addAccount(data).then((resp:any)=>{
        resp.subscribe((response:any)=>{
          console.log('la resp', response)
        })
      });
    }else{
      console.log('SELECTED RIGHTS : ',this.selectedRights,this.rightsUser)
      this.fireStoreServiceImages.addImagesOfCustomers(this.data.id, this.eventImageFile);
      // this.userHandlersServiceCustomer.updateAccountCustomer(this.data.id, data);
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
  firstName = new FormControl('', [ Validators.required ]);
  familyName = new FormControl('', [ Validators.required ]);
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
  // this.user = JSON.parse(localStorage.getItem('user') || '{}');

  // console.log('LES DATAS MODALS USER ::',this.data,  this.user)
  //  console.log('LES DATAS MODALS USER ::', this.data.data.traineds)
  if(this.data !== null){
    if(this.data.trained !== undefined ){
        // this.update = true;
        // this.name.setValue(this.data.trained.name);
        // this.firstname.setValue(this.data.trained.firstname);
        // this.email.setValue(this.data.trained.email);
        // this.phone.setValue(this.data.trained.phone);
        // this.address.setValue(this.data.trained.address);
        // this.zip.setValue(this.data.trained.zip);
        // this.city.setValue(this.data.trained.city);
        // this.comment.setValue(this.data.trained.comment);
        // this.size.setValue(this.data.trained.size);
        // this.weight.setValue(this.data.trained.weight);
        // this.selectedObjectifs =  this.data.trained.objectif;
        // this.selectedDiscipline =  this.data.trained.discipline;
        // this.selectedLevel =  this.data.trained.level;
        // this.selectedManuality =  this.data.trained.manuality;
        // this.selectedGender =  this.data.trained.gender;

      }
    }
  }

  selectChangeLevel(event:any){ this.selectedLevel = event.value; }

  selectChangeDiscipline(event:any){ this.selectedDiscipline = event.value;}

  selectChangeObjectifs(event:any){ this.selectedObjectifs = event.value;}

  selectChangeManuality(event:any){ this.selectedManuality = event.value;}

  selectChangeGender(event:any){ this.selectedGender = event.value;}

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
      console.log(
        this.name.value,
        this.firstName.value,
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
          // this.rightsUser = this.selectedRights;
          // this.roleUser =  this.selectedRole;
          let data = {
            email: this.email.value,
            passwordHash:"",
            firstName: this.firstName.value,
            familyName: this.familyName.value,
            fullName: this.firstName.value + ' ' +  this.familyName.value,
            avatarURL: "",
            role: "user",
            owner:this.data.id,
            personalInfo: {
                birthdate: this.birthdate,
                // simpleBirthdate: this.simpleBirthdate,
                address1: this.address.value,
                address2: "",
                zip: this.zip.value,
                city: this.city.value,
                // region: this.region.value,
                phone: this.phone.value,
                comment: this.comment.value
            },
            privileges: {
                rights: this.rightsUser
            },
            users: [],
            staff: [],
            econes: [],
            trainings: [],
            videos: [],
            // licensed: this.licences.value,
            warning: false
          }
          console.log('REAL CREATE : ',this.data, data)
          this.userHandlersServiceCustomer.addAccount(data).then((resp:any)=>{
            resp.subscribe((response:any)=>{
              console.log('la resp du add user : ! ', response)
              this.data.users.push({id:response.account.id})

              // this.userHandlersServiceCustomer.updateAccount(this.data).then((resp:any)=>{
              //   resp.subscribe((response:any)=>{
              //     console.log('la resp du update user owner: ! ', response)

              //   })
              // });
            })
          });
      }else{
      console.log('RREAL UPDATE : ',this.data)
      // let dataForm = {traineds: {uuid:this.data.trained.uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
      //   objectif:this.selectedObjectifs,size:this.size.value,weight:this.weight.value, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,level:this.selectedLevel,
      //   gender:this.selectedGender,manuality:this.selectedManuality,
      //   date:this.data.trained.date,
      //   update: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
      // }}
        // console.log('SELECTED RIGHTS : ',dataForm)
        // this.fireStoreServiceImages.addImagesOfTrained(this.data.id, this.eventImageFile);
        // this.userHandlersServiceCustomer.updateAccountTrained(this.data, dataForm);
    }
    setTimeout(() => {
      this.dialogRef.close();
      // console.log('on email user aout', this.update, this.data.email)
      // let passWord = 'Drilllight2023';
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
          // this.userHandlersServiceAdmin.getAccountWithEmail(this.user.email).subscribe((dataAccount:any) =>{
          //   console.log('WE GONE SAVE THIS DATA : ! ',dataAccount.docs[0].data())
          //   //localStorage.setItem('account', JSON.stringify(dataAccount.docs[0].data()));
          //   this.utilsService.sendNewDataOfCustomer({data:true})
          // });
        }else{
          // this.storageServiceMail.updateAccountTrained(this.email.value, this.name.value)
        }
      }
      // console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord);
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
    // if(this.data.trained !== undefined){
    //     if(this.data.ProfilAccount.traineds !== undefined){
    //       // this.selectedTraineds = this.data.trained.traineds;
    //       this.traineds = this.data.ProfilAccount.traineds;
    //       this.update = true;
    //       // this.data.ProfilAccount.traineds.forEach((trained:any) => {
    //       //   this.selectedTraineds.push(trained.name+ ' '+ trained.firstname )
    //       // });
    //     }
    //     console.log("LES DATAS TRAINEDS :: ",this.selectedTraineds);
    //     this.name.setValue(this.data.trained.name);
    //     this.firstname.setValue(this.data.trained.firstname);
    //     this.email.setValue(this.data.trained.email);
    //     this.phone.setValue(this.data.trained.phone);
    //     this.address.setValue(this.data.trained.address);
    //     this.zip.setValue(this.data.trained.zip);
    //     this.city.setValue(this.data.trained.city);
    //     this.comment.setValue(this.data.trained.comment);
    //     this.selectedRole =  this.data.trained.roles;
    //     this.selectedLevel = this.data.trained.level;
    //     this.selectedDiscipline =  this.data.trained.discipline;
    //     console.log('DISCIPLINE : ',this.selectedDiscipline)
    // }else{
    //   console.log('LES DATAS POUR LE CREATE DU STAFF ! ',this.data)
    //   // if(this.data.data.traineds !== undefined || this.data.data.traineds.length >0){
    //   //   this.traineds = this.data.data.traineds;
    //   //   console.log('LES ENTRAINES :: !', this.traineds)
    //   // }
    //   if(this.data.traineds !== undefined || this.data.traineds.length >0){
    //     this.traineds = this.data.traineds;
    //     console.log('LES ENTRAINES :: !', this.traineds)
    //   }
    // }
  }

  selectChangeLevel(event:any){ this.selectedLevel = event.value;}

  selectChangeDiscipline(event:any){ this.selectedDiscipline = event.value;}

  selectChangeRole(event:any){ this.selectedRole = event.value;}

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
      this.firstName.value,
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

          let data = {
            email: this.email.value,
            passwordHash:"",
            firstName: this.firstName.value,
            familyName: this.familyName.value,
            fullName: this.firstName.value + ' ' +  this.familyName.value,
            avatarURL: "",
            role: "staff",
            owner:this.data.id,
            personalInfo: {
                birthdate: this.birthdate,
                // simpleBirthdate: this.simpleBirthdate,
                address1: this.address.value,
                address2: "",
                zip: this.zip.value,
                city: this.city.value,
                // region: this.region.value,
                phone: this.phone.value,
                comment: this.comment.value
            },
            privileges: {
                rights: this.rightsUser
            },
            users: [],
            staff: [],
            econes: [],
            trainings: [],
            videos: [],
            // licensed: this.licences.value,
            warning: false
          }
          console.log('STAFF : ! ',this.data, data)
          this.userHandlersServiceCustomer.addAccount(data).then((resp:any)=>{
            resp.subscribe((response:any)=>{
              console.log('la resp du add user : ! ', response)
              // this.data.staff.push({id:response.account.id})
              // this.userHandlersServiceCustomer.updateAccount(this.data).then((resp:any)=>{
              //   resp.subscribe((response:any)=>{
              //     console.log('la resp du update staff owner: ! ', response)

              //   })
              // });
            })
          });
      }else{
      console.log('RREAL UPDATE : ',this.data)
      // let dataForm = {traineds: {uuid:this.data.trained.uuid, avatarimages: this.eventImageFile, name: this.name.value,firstname: this.firstname.value,email: this.email.value,phone:this.phone.value,address:this.address.value,zip:this.zip.value,city:this.city.value,comment:this.comment.value,discipline:  this.selectedDiscipline,
      //   level:this.selectedLevel,roles:this.selectedRole, birthdate:this.birthdate,simplebirthdate: this.simplebirthdate,
      //   traineds:this.selectedTraineds,
      //   date:this.data.trained.date,
      //   update: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
      // }}


    }
    setTimeout(() => {
      this.dialogRef.close(this.data);
      // this.userHandlersServiceAdmin.getAccountWithEmail(this.user.email).subscribe((dataAccount:any) =>{
      //   console.log('WE GONE SAVE THIS DATA : ! ',dataAccount.docs[0].data())
      //   //localStorage.setItem('account', JSON.stringify(dataAccount.docs[0].data()));
      //   this.utilsService.sendNewDataOfCustomer({data:true})
      // });
      // console.log('on email user aout', this.update)
      // let passWord = 'Drilllight2023';
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
      // console.log('ON VA SAVE AVEC CET EMAIL 2::',this.email.value, passWord)

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
