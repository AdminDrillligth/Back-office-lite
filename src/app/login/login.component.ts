import { Component, OnInit, Injectable } from '@angular/core';
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
import { Buffer } from 'buffer';


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
    // private afAuth: AngularFireAuth,
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
    // this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
    //   this.ipAddress = res.ip;
    //   console.log('IP ADRESS : !',this.ipAddress)
    // });
  }

  doLogin(){
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
    if(this.emailFormControl.value !== null && this.passwordFormControl.value !== null){
        const authorizationValue = 'Basic ' + Buffer.from( this.emailFormControl.value + ':' + this.passwordFormControl.value ).toString('base64');
        console.log('Le basic : ',authorizationValue)
        const headers = { 'content-type': 'application/json'}  
        const body = JSON.stringify({username:this.emailFormControl.value,password:this.passwordFormControl.value});
          console.log(body)
          this.http.get(this.baseURL+'getToken' ,{'headers':{passwordhash:authorizationValue, username:this.emailFormControl.value}}).subscribe((response:any) => {
            console.log('LA REP DU GET TOKEN  : ',response)
            if(response.response.result === "success"){
              localStorage.setItem('token', response.token);
              localStorage.setItem('userId', response.id);
              let tokenlocal = localStorage.getItem('token') || '{}';
              let userId = localStorage.getItem('userId') || '{}';
              console.log(tokenlocal,userId );
              this.http.get(this.baseURL+'getAccountDetails' ,{'headers':{token:tokenlocal, id:userId}}).subscribe((response:any) => {
                console.log('resp get details of user: ', response.account)
                if(response.response.result === "success"){
                  localStorage.setItem('account', JSON.stringify(response.account));
                  this.http.get(this.baseURL+'getAccountsList' ,{'headers':{token:tokenlocal, id:userId}}).subscribe((response:any) => {
                    if(response.response.result === "success"){
                      localStorage.setItem('accounts-data', JSON.stringify(response.accounts));
                      console.log('LIST DES USERS : ! ', response.accounts)
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
    console.log('on reset le password')
    const dialogRef = this.dialog.open(resetPasswordDialog, { panelClass: 'panel-class'});

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

export class resetPasswordDialog {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  badpassuser : boolean= false;
}