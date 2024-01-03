import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  baseURL: string = "https://us-central1-drilllight.cloudfunctions.net/app/";
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value :number = 50;
  badpassword : boolean= false;
  badpassuser : boolean= false;
  constructor(
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private http:HttpClient,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private afAuth: AngularFireAuth,
    private router: Router
  ){}
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  myInterval:any;
  ipAddress:any;
  warning =  false;
  dataOfUser:any = [];
  ngOnInit(): void {
    this.getIPAddress();
  }

  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
      console.log('IP ADRESS : !',this.ipAddress)
    });
  }

  doLogin(){
    // console.log('value', this.emailFormControl.value, this.passwordFormControl.value)
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
    // this.myInterval = setInterval(this.spinTimer, 1000);
    if(this.emailFormControl.value !== null && this.passwordFormControl.value !== null){
      this.afAuth.signInWithEmailAndPassword(this.emailFormControl.value, this.passwordFormControl.value).then((loginResponse: any) => {
        localStorage.setItem('user', JSON.stringify({email:this.emailFormControl.value, timeStamp: '', timerMilli:1200000}));
        console.log('LOGIN  ::: ',loginResponse);
        // const token = await afAuth.currentUser.getIdToken();
        this.afAuth.currentUser.then((current:any) => {
          console.log('TOKEN DE CONNECTION DU USER : ', current.auth.currentUser.accessToken);
          const headers = { 'content-type': 'application/json'}  
          const body = JSON.stringify({username:this.emailFormControl.value,password:this.passwordFormControl.value});
          console.log(body)
          this.http.post(this.baseURL+'login' , body,{'headers':headers}).subscribe((response:any) => {
            this.dataOfUser = response;
            let token = this.dataOfUser.token;
            localStorage.setItem('token', token);
            let tokenlocal = localStorage.getItem('token') || '{}';
            console.log('LE TOKEN LOCAL : ',tokenlocal)
            if(this.dataOfUser.status === "success"){
              this.router.navigate(['dashboard']);
              this.utilsService.howToSeeNavigation(true);
              localStorage.setItem('account', JSON.stringify(this.dataOfUser.user));
              let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
              console.log('ACCOUNT OF USER LOGIN :! : ', AccountOfUser);
              if(AccountOfUser.asAdmin === true){
                // IF ADMIN == TRUE
                console.log('is an admin')
                const headersGet = { 'content-type': 'application/json','token':token}
                this.http.get(this.baseURL+'user' ,{'params':{'token':token}}).subscribe((response:any) => {
                    console.log('We get all users : ', response, token)
                    // if(response.decoded !== 'err'){
                    localStorage.setItem('account-datas', JSON.stringify(response.allUsers));
                    let allAccounts = JSON.parse(localStorage.getItem('account-datas') || '{}');
                    console.log('ALL ACCOUNTS DETAILS :  !',allAccounts, response.decoded)
                  // }else{

                  // }
                })
              }else{
                // IF ADMIN === FALSE
              }
            }else{
              
              // NO ACCOUNT 
              // IF NO ACCOUNT
            }
          })
        })
        // console.log('TOKEN DE CONNECTION : ! ',token, currentUser)
        this.userHandlersServiceAdmin.updateAccountAdminWithEmailLastUpdate(this.emailFormControl.value, this.ipAddress).then((e:any) =>{
          // console.log("WARNING ???",e)
        
          // if(e == true) {
          //   console.log("WARNING ???",e)
          //   this.warning =  true
          // }else{
          //   if(e === 'modéré'){
          //     alert('Votre compte est en cours de modération');
          //     this.router.navigate(['login']);
          //   }else{
          //    if(e !== true){
          //     console.log("WARNING ???",e)
          //     this.router.navigate(['dashboard']);
          //    }
          //   }
          // }
        })
      }).catch((error) => {
        // Error Handling
        var errorCode = error.code;
        if(errorCode === 'auth/wrong-password'){
           this.badpassword = true;
        }
        if(errorCode === 'auth/user-not-found'){
          this.badpassuser = true;
          console.log('LE USER',this.badpassuser)
        }
        setTimeout(() => {
          this.badpassuser = false;
          this.badpassword = false;
        }, 2000);
      });
    }
  }
    // 
  }

  spinTimer() {
    // this.value = 20;
    console.log(this.value)
  }

  myStopFunction() {
    clearInterval(this.myInterval);
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
    console.log('on reset le password')
    const dialogRef = this.dialog.open(resetPasswordDialog, { panelClass: 'panel-class'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    //   this.afAuth.auth.resetPasswordInit(result)
    //   .then(() => 
    //     alert('A password reset link has been sent to your email address'),
    //      (rejectionReason:any) => alert(rejectionReason))
    //   .catch(e => alert('An error occurred while attempting to reset your password'));
    this.afAuth.sendPasswordResetEmail(result).then(
      () => {
        alert('A password reset link has been sent to your email address')
        // success, show some message
      },
      err => {
        alert('error email address')
        // handle errors
      }
    );
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

export class resetPasswordDialog {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  badpassuser : boolean= false;
}