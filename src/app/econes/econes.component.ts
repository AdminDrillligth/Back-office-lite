import { Component, OnInit, Inject, ViewChild, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule , } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule, SafeUrl } from '@angular/platform-browser';
import { FireStoreServiceImages } from '../../services/firebase/firestoreservice-images';
import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';
import { UserHandlersServiceAdmin } from '../../services/user-handlers-admin.service';
import { EconesService } from '../../services/econes.service';
import { uid } from 'uid';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { UtilsService } from '../../services/utils.service';
// BUNDLE QR CODE
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QRCodeElementType } from "angularx-qrcode";
import { FixMeLater } from "../../../angularx-qrcode/src/public-api"
//ANGULAR TABLE
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FirmWareService } from '../../services/firmware.service';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';



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



export interface EconeDatas {
  SeeQrCode:boolean,
  date:string,
  dateIso:string,
  email:string,
  firstname:string,
  id:string,
  name:string,
  qrdata:string,
  seeQr:boolean,
  serial:string,
  uuid:string,
  uuidOfCustomer:string
}

@Component({
  selector: 'app-econes',
  templateUrl: './econes.component.html',
  styleUrls: ['./econes.component.scss'],


})

export class EconesComponent implements OnInit {
  // displayedColumns: string[] = ['id', 'serial', 'name', 'date','client'];
 
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
  public qrCodeSrc!: SafeUrl
  public selectedIndex!: number;
  public showA11y: boolean = false;
  public showColors: boolean = false;
  public showCss: boolean = false;
  public showImage: boolean = false;
  displayedColumnsEcones: string[] = [' ','id', 'serial','date','client','actions'];
  EmpDatasEcones : EconeDatas[] = [];
  public firmWareList:any = [];
  public privateFirmwareId = false;


  @ViewChild('paginatorEcones')
  paginatorEcones!: MatPaginator;

  resultsLength = 40;
  constructor(
    private _snackBar: MatSnackBar,
    private firmWareService:FirmWareService,
    private econesService:EconesService,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private router: Router
  ){
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

  UserDataAccount:any[]=[];
  user:any;
  account:any;
  Econes:any[any] = [];
  SeeQrCode:any = false;
  dataSourceEcones!: MatTableDataSource<EconeDatas>;
  allAccounts:any;
  allAccountsAdminOwner:any = [];
  selectedUser:string ="";
  private:boolean=false;
  ngOnInit(): void {
    this.allAccounts = JSON.parse(localStorage.getItem('accounts-data') || '{}');
    this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    this.allAccounts.forEach((account:any) =>{
      if(account.role === 'admin' || account.role === 'owner'){
        this.allAccountsAdminOwner.push(account)
      }
    })
    console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme);
    });
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.account = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('account : ! ',this.account)
    if(this.account.role ==="admin"){
      this.firmWareService.getFirmwareList().then((firmwareList:any)=>{
        console.log('list of firwares: ',firmwareList)
        firmwareList.subscribe((list:any)=>{
          console.log('list of firwares: ',list.firmwareList)
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
    this.getEconesFromDataBase();
    // on récuprére les données relatives a tous les pods
    this.utilsService._dataOfEconesSend.subscribe((listEcones:any) =>{
      this.Econes = listEcones;
      this.dataSourceEcones = new MatTableDataSource(this.Econes);
      this.dataSourceEcones.paginator = this.paginatorEcones;
      console.log('ECONES ! : ',this.Econes,'ACCOUNTS', this.UserDataAccount )
      if(this.Econes !== null){
        if(this.Econes.length > 0){
          setTimeout(()=>{ this.parserEconesToCustomers(); },300)
        }
      }
    });
    this.utilsService._newaccount.subscribe((update:any) =>{
      console.log('ALLONS NOUS UPDATE ? ',update)
       if(update !== null){
         if(update == true){
          let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
          this.UserDataAccount =  allAccounts;
          console.log('ECONES ! : ',this.Econes,'ACCOUNTS', this.UserDataAccount )
          if(this.Econes !== null){
            if(this.Econes.length > 0){
              setTimeout(()=>{ this.parserEconesToCustomers(); },300)
            }
          }
        }
        }
      })
  }

  parserEconesToCustomers(){
    if(this.Econes !== null){
      if(this.Econes.length > 0){
        for (let i = 0; i < this.Econes.length; i++) {
          this.UserDataAccount.forEach((user:any) =>{
            if(this.Econes[i].customerId === user.data.id){
              this.Econes[i].name = user.data.firstName +' '+ user.data.personalInfos.familyName;
            }
          });
        }
      }
    }
  }

  getEconesFromDataBase(){
    this.UserDataAccount = [];
    this.Econes = [];
    this.econesService.getAllEcones();
    this.userHandlersServiceAdmin.getAccountAdmin()
  }

  search(){
    const dialogRef = this.dialog.open(DialogSearch, {
      panelClass: 'bg-color',
      width:'80%',
    });
    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  applyFilter(event: Event) {
    console.log('LE SEARCH : ',event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEcones.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  parameters(){
    const dialogRef = this.dialog.open(DialogParameters, {
      panelClass: 'bg-color',
      width:'80%',
    });
    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  closeModalQr(Econe:any){
    
  }

  uploadZip(){
    console.log('upload zip')
    this.displayModal = true;
  }
  
  closeModal(){
    this.displayModal = false;
  }

  selectUser(){
    console.log(this.selectedUser)
  }

  uploadZipAndUserFalse(){
    if(this.displayListOfUSer = true){
      this.displayListOfUSer = false;
      this.private = false;;
    }
  }

  displayListOfUSer = false;
  uploadZipAndUser(){
    console.log(this.private)
    if(this.private == true){
      this.displayListOfUSer = true;
    }else{
      this.chargeZipFirmware();
    }

  }

  displayModal = false;
  displayBtnUpload = false;
  srCzip :any = "";
  //ZIP FIRMWARE CHECK AND UPDATE  
  onchangeInputZip(zip:any){
    console.log(zip)
    const file = zip.target.files[0];
    // this.AccountOfUser.id
    // // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
        console.log(reader.result);
        console.log(reader);
        this.displayBtnUpload = true;
        // this.base64ToBlob(reader.result);
        this.srCzip = reader.result;
        // this.firmWareService.createFirmware(this.srCzip, this.AccountOfUser.id);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(file);
    
    // // this.unzip();

  }

  versionOfFirmwareValue:string="";
  commentOfFirmwareValue:string="";
  versionOfFirmware(event:any){
    console.log(event.target.value)
    this.versionOfFirmwareValue = event.target.value;
  }

  commentOfFirmware(event:any){
    console.log(event.target.value)
    this.commentOfFirmwareValue = event.target.value;
  }

  AccountOfUser:any;
  chargeZipFirmware(){
    if(this.srCzip !== ''){
      console.log('LE ZIP SRC : ',this.srCzip)
      let firmwareData = { base64:this.srCzip, comment:this.commentOfFirmwareValue, version:this.versionOfFirmwareValue }
      this.firmWareService.createFirmware(firmwareData, this.AccountOfUser.id,false);
    }
    this.displayModal = false;
    this._snackBar.openFromComponent(snackComponent, { duration:  1000,});
    
  }

  chargeZipFirmwareWithUser(){
    if(this.srCzip !== ''){
      console.log('LE ZIP SRC : ',this.srCzip)
      let firmwareData = { base64:this.srCzip, comment:this.commentOfFirmwareValue, version:this.versionOfFirmwareValue }
      this.firmWareService.createFirmware(firmwareData, this.selectedUser, true);
    }
    this.displayModal = false;
    
  }

  getZipFirmware(){
    this.firmWareService.getFirmware(this.AccountOfUser.id);
  }

  updateGlobalFirmware(){
    if(this.selectedVersion !== ""){
      this.displayModalUpdateFirmware = false;
      console.log(this.selectedVersion);
      this.firmWareService.updateGlobalFirmware(this.selectedVersion);
    }

  }
  
  displayModalUpdateFirmware = false;
  chooseFirmwareGlobal(){
    this.displayModalUpdateFirmware = true
    console.log("on va choose le firmware : !")
  }

  selectedVersion:any="";
  selectedFirmware(firmware:any){
    console.log('FIRMWARE : ! ',firmware.id,firmware)
    this.selectedVersion = firmware;
  }

  closeModalUpdateFirmware(){
    this.displayModalUpdateFirmware = false
    // console.log("on va choose le firmware : !")
  }

  displayQrOfEcone(Econe:any){
    //  console.log(Econe.id)
    this.Econes.forEach((econe:any, index:number) => {
      //  console.log('ECONE ! : ',econe.id,Econe.id, index);
      if(econe.id === Econe.id){
        //  console.log('ECONE ! : : ',econe.id,Econe.id, index);
        if(econe.SeeQrCode == false){
          // console.log('ECONE ! : : ',econe.SeeQrCode,econe.id,Econe.id, index);
          this.Econes[index].SeeQrCode = true;
          //  console.log('ECONE ! : : ',this.Econes);
        } else{
          // console.log('ECONE ! : : ',econe.SeeQrCode, econe.id,Econe.id, index);
          this.Econes[index].SeeQrCode = false;
          //  console.log('ECONE ! : : ',this.Econes);
        }
      }
    })
  }

  updateMaster(){
    const dialogRef = this.dialog.open(DialogUpdateMaster, {
      panelClass: 'bg-color',
      width:'80%',
    });
    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  addEconesAsAdmin(){
    const dialogRef = this.dialog.open(addEconesAdmin, {
      data:this.UserDataAccount,
      panelClass: 'bg-color',
      width:'80%',
      height:'80%'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.getEconesFromDataBase();
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
}





@Component({
  selector: 'dialog-search',
  templateUrl: './dialog/search.html',
  styleUrls: ['./econes.component.scss'],
  standalone: true,
  imports: [ MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogSearch implements OnInit{
  constructor(
    private utilsService:UtilsService,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogSearch>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
   console.log('LES DATAS MODALS MODERATE',this.data)
  }

  find(){
    this.dialogRef.close();
  }

}


@Component({
  selector: 'dialog-parameter',
  templateUrl: './dialog/parameter.html',
  styleUrls: ['./econes.component.scss'],
  standalone: true,
  imports: [ MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogParameters implements OnInit{
  constructor(
    private utilsService:UtilsService,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogParameters>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
   console.log('LES DATAS MODALS MODERATE',this.data)
  }

  update(){

  }
}


@Component({
  selector: 'dialog-update-econe',
  templateUrl: './dialog/update-econe.html',
  styleUrls: ['./econes.component.scss'],
  standalone: true,
  imports: [ MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogUpdateMaster implements OnInit{

  constructor(
    private econesService:EconesService,
    private utilsService:UtilsService,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<DialogUpdateMaster>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
   //console.log('LES DATAS MODALS MODERATE',this.data)
  }

  update(){

  }

}


@Component({
  selector: 'dialog-add-econes',
  templateUrl: './dialog/add-econes.html',
  styleUrls: ['./econes.component.scss'],
  standalone: true,
  imports: [MatCheckboxModule, MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule, ReactiveFormsModule, MatNativeDateModule,MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class addEconesAdmin implements OnInit{
  serialNumber = new FormControl('', [ Validators.required ]);
  Customers :any[]=[];
  selectedCustomer:any ='';
  firmware= new FormControl('', [ Validators.required ]);
  SSID= new FormControl('', [ Validators.required ]);
  PassWordOfSSID= new FormControl('', [ Validators.required ]);
  asMaster = true;
  password = new FormControl('', [ Validators.required ]);
  constructor(
    private econesService:EconesService,
    private utilsService:UtilsService,
    private fireStoreServiceImages:FireStoreServiceImages,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    public dialogRef: MatDialogRef<addEconesAdmin>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit(): void {
   console.log('LES DATAS MODALS NEW ECONES ',this.data);
   this.data.forEach((customer:any) =>{
    console.log(customer);
    // si il n'est pas Admin
    if(customer.data.asAdmin !== true){
      this.Customers.push(customer);
      console.log(this.Customers);
    }else{
    // ou 

    }
   })
  }

  close(){
    console.log(this.serialNumber.value, this.selectedCustomer, this.firmware.value, this.SSID.value)
    if(this.serialNumber.value !== ''){
      console.log(this.serialNumber.value, this.selectedCustomer)
      this.econesService.addEcones({serial:this.serialNumber.value, firmware:this.firmware.value, SSID:this.SSID.value, passwordSSID: this.password.value, idOfCustomer:this.selectedCustomer });
    }
    this.dialogRef.close();
  }

  selectChangeClient(event:any){
    console.log('ON CHANGE LE CUSTOMER : !  ', event.value);
    this.selectedCustomer = event.value;
    this.selectedCustomer = this.selectedCustomer.data.id
  }

}

