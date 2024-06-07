import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
// import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserHandlersServiceAdmin } from '../../services/user-handlers-admin.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective, FormGroup } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule , } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../services/utils.service';
import { TokenService } from '../../services/token.service';
import { Buffer } from 'buffer';
import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";
  linuxBackEnd: string = "https://devserver.drilllight.com/";
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value :number = 50;
  badpassword : boolean= false;
  badpassuser : boolean= false;
  bademail : boolean= false;
  badWarning :boolean = false;
  isChecked:any = true;
  constructor(
    private tokenService:TokenService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private http:HttpClient,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    // private afAuth: AngularFireAuth,
    private router: Router
  ){}
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  myInterval:any;
  ipAddress:any;
  warning =  false;
  dataOfUser:any = [];
  disabledSpinner = false;
  ngOnInit(): void {

    this.getIPAddress();
    localStorage.setItem('backEnd', this.isChecked);
  }


  checkBackEnd(backend:any){
    console.log(backend)
    localStorage.setItem('backEnd', backend);
  }

  getIPAddress()
  {
    // this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
    //   this.ipAddress = res.ip;
    //   console.log('IP ADRESS : !',this.ipAddress)
    // });
  }

  doLoginBackEnd(){
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      if(this.emailFormControl.value !== null && this.passwordFormControl.value !== null){
        this.disabledSpinner = true;
        const authorizationValue = 'Basic ' + Buffer.from( this.emailFormControl.value + ':' + this.passwordFormControl.value ).toString('base64');
        console.log('Le basic : ',authorizationValue)
        const headers = { 'content-type': 'application/json'}
        const body = JSON.stringify({username:this.emailFormControl.value,password:this.passwordFormControl.value});
          console.log(body)
          this.http.get(this.linuxBackEnd+'token/getToken',{'headers':{passwordhash:authorizationValue, username:this.emailFormControl.value}}).subscribe((response:any) => {
            if(response.response.result === "errorBlockedAccount"){
              this.disabledSpinner = false;
              this.badWarning = true;
              setTimeout(() => {
                this.badWarning = false;
              }, 1500);
            }
            if(response.response.result === "invalidPasswordError"){
              this.disabledSpinner = false;
              this.badpassword = true;
              setTimeout(() => {
                this.badpassword = false;
              }, 1500);
            }
            if(response.response.result === "errorNoAccount"){
              this.disabledSpinner = false;
              this.bademail = true;
              setTimeout(() => {
                this.bademail = false;
              }, 1500);
            }
            console.log('LINUX BACK END : ',response)
            localStorage.setItem('tokenAPI', response.token);
            let tokenAPI = localStorage.getItem('tokenAPI') || '{}';
            // console.log('rep dispatch ?')
            localStorage.getItem('backEnd');
            if(response.response.result === 'success'){
              localStorage.setItem('tokenAPI', response.token);
              let tokenAPI = localStorage.getItem('tokenAPI') || '{}';
              console.log('getAccountDetails: Preset : !',response, "TOKEN API: ", tokenAPI)
              this.http.get(this.linuxBackEnd+'account/getAccountDetails',{'headers':{token:response.token, id:response.id}}).subscribe((response:any) => {
                console.log('getAccountDetailsAPI: ',response)
                console.log('getAccountDetailsAPI: ',response.account.id)
                localStorage.setItem('account', JSON.stringify(response.account));
                localStorage.setItem('userId', response.account.id);
                if(response.response.result === 'success'){
                  if(response.account.role === 'admin'){
                    this.http.get(this.linuxBackEnd+'account/getAccountsList' ,{'headers':{token:tokenAPI, id:response.account.id}}).subscribe((response:any) => {
                      console.log('LIST DU  GET LIST API API API :) ":^D: ! ', response)
                      localStorage.setItem('accounts-data', JSON.stringify(response.accounts));
                      this.disabledSpinner = false;
                      this.router.navigate(['dashboard']);
                      this.utilsService.howToSeeNavigation(true);
                    })
                  }
                }
                // localStorage.setItem('accountAPI', JSON.stringify(response.account));
             })
            }
          });


      }
    }
  }

  doLogin(){
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
    if(this.emailFormControl.value !== null && this.passwordFormControl.value !== null){
        this.disabledSpinner = true;
        const authorizationValue = 'Basic ' + Buffer.from( this.emailFormControl.value + ':' + this.passwordFormControl.value ).toString('base64');
        console.log('Le basic : ',authorizationValue)
        const headers = { 'content-type': 'application/json'}
        const body = JSON.stringify({username:this.emailFormControl.value,password:this.passwordFormControl.value});
          console.log(body)

          this.http.get(this.baseURL+'getToken' ,{'headers':{passwordhash:authorizationValue, username:this.emailFormControl.value}}).subscribe((response:any) => {
            console.log('LA REP DU GET TOKEN  : ',response)
            if(response.response.result === "errorBlockedAccount"){
              this.disabledSpinner = false;
              this.badWarning = true;
              setTimeout(() => {
                this.badWarning = false;
              }, 1500);
            }
            if(response.response.result === "invalidPasswordError"){
              this.disabledSpinner = false;
              this.badpassword = true;
              setTimeout(() => {
                this.badpassword = false;
              }, 1500);
            }
            if(response.response.result === "errorNoAccount"){
              this.disabledSpinner = false;
              this.bademail = true;
              setTimeout(() => {
                this.bademail = false;
              }, 1500);
            }
            if(response.response.result === "success"){
              localStorage.setItem('token', response.token);
              localStorage.setItem('userId', response.id);
              let tokenlocal = localStorage.getItem('token') || '{}';
              let userId = localStorage.getItem('userId') || '{}';
              console.log('RESP WHEN WE LOGIN : ! ',tokenlocal,userId );
              this.tokenService.validateToken(userId);


              this.http.get(this.baseURL+'getAccountDetails' ,{'headers':{token:tokenlocal, id:userId}}).subscribe((response:any) => {
                console.log('resp get details of user WHEN WE LOGIN : ', response.account)
                if(response.response.result === "success"){

                  localStorage.setItem('account', JSON.stringify(response.account));
                  this.http.get(this.baseURL+'getAccountsList' ,{'headers':{token:tokenlocal, id:userId}}).subscribe((response:any) => {
                    console.log('LIST DES USERS : ! ', response)
                    if(response.response.result === "success"){
                      localStorage.setItem('accounts-data', JSON.stringify(response.accounts));
                      console.log('LIST DES USERS : ! ', response)
                      this.disabledSpinner = false;
                      this.router.navigate(['dashboard']);
                      this.utilsService.howToSeeNavigation(true);
                    }
                  })
                }
              })
            }else{

              // NO ACCOUNT
              // IF NO ACCOUNT
            }
          })
    }
  }
    //
  }

  disconectedMode(){
    if(localStorage.getItem('user') !== null){
      let user :any = localStorage.getItem('user')
      console.log('Notre user',user)
      // Lets 3hours for this local Timing !

       if(user !== null && user.email !== undefined ){

        console.log('connexion locale ! ')
      //   if (user.timeStamp < timeStamp - user.localDateIso){
      //     console.log('connexion after time stamp ! ')
      //     this.router.navigate(['main']);
      //   }
       }
    }
  }

  resetPassWord(){
    console.log('on reset le password',this.emailFormControl.value )
    const dialogRef = this.dialog.open(resetPasswordDialog, {data:this.emailFormControl.value, panelClass: 'panel-class'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    //   this.afAuth.auth.resetPasswordInit(result)
    //   .then(() =>
    //     alert('A password reset link has been sent to your email address'),
    //      (rejectionReason:any) => alert(rejectionReason))
    //   .catch(e => alert('An error occurred while attempting to reset your password'));
    // this.afAuth.sendPasswordResetEmail(result).then(
    //   () => {
    //     alert('A password reset link has been sent to your email address')
    //     // success, show some message
    //   },
    //   err => {
    //     alert('error email address')
    //     // handle errors
    //   }
    // );
    });
  }
}


@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [  ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatFormFieldModule, MatDialogModule, FormsModule, MatButtonModule],

})

export class resetPasswordDialog implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<resetPasswordDialog>,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  badpassuser : boolean= false;
  bademailuser:boolean=false;
  ngOnInit(): void {
    console.log('LES DATAS MODALS MODERATE',this.data)
    this.emailFormControl.setValue(this.data);
    // this.emailFormControl = this.data;
  }


  sendResetPassword(){
    console.log('email reset : ',this.emailFormControl.value)
    this.userHandlersServiceCustomer.getAccountDetails(this.emailFormControl.value).then((resp:any)=>{
      resp.subscribe((e:any) =>{
      console.log('LE SUBSCRIBE DE LA REP In PASSWORD: ',e.account)

      console.log('LE SUBSCRIBE : ',e.response.result)
      if(e.response.result === "noAccountError"){
        this.bademailuser = true;
        setTimeout(() => { this.bademailuser = false; }, 1500);
      }else{
        let ProfilAccount = e.account;
        this.userHandlersServiceCustomer.updateAccountResetPassword(ProfilAccount).then((resp:any)=>{
          resp.subscribe((response:any)=>{
            console.log('la resp du user update reset password : ! ', response)
          });
        });
        // this.dialogRef.close();
      }
      // this.account = e.account;
      // this.email = e.account.email;
      // console.log('ON GET LE MAIL : ! ',this.email)
      })
    });
  }

}