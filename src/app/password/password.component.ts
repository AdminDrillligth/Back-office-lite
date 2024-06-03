import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';
import { UtilsService } from '../../services/utils.service';
// var btoa = require('btoa');
import { Buffer } from 'buffer';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  firstName =  new FormControl('', [Validators.required]);
  familyName =  new FormControl('', [Validators.required]);
  phoneNumber =  new FormControl('', [Validators.required]);
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}/;
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  passwordConfirmFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  form:any;
  error:string='';
  code:any;
  id:any="";
  email:any="";
  seeChangePage = false;
  account:any=[];
  constructor(
    private utilsService: UtilsService,
    private userHandlersServiceCustomer:UserHandlersServiceCustomer,
    private router:Router,
    private fb: FormBuilder, 
    private Auth:AngularFireAuth, 
    private route : ActivatedRoute
    ){
    this.form = this.fb.group({

      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      samepassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)])
    
    });
  }

  // 

  ngOnInit(): void {
    let backend = localStorage.getItem('backEnd');
    console.log('backend Password: ! ',backend)
    this.id = this.route.snapshot.queryParams['id'];
    console.log('id : ! ', this.id)
    if(this.id !== ""){
      const authorizationValue = 'Basic ' + btoa( this.email + ':' + this.form.get('password').value );
      console.log('Le auth:!', authorizationValue)
    }
    this.userHandlersServiceCustomer.getAccountDetails(this.id).then((resp:any)=>{
      resp.subscribe((e:any) =>{
      console.log('LE SUBSCRIBE DE LA REP In PASSWORD: ',e.account)
      this.account = e.account;
      this.email = e.account.email;
      console.log('ON GET LE MAIL : ! ',this.email)
      if(e.account.familyName !== undefined){
        this.familyName.setValue(e.account.familyName);
        console.log(this.familyName)
      }
      if(e.account.firstName !== undefined){
        this.firstName.setValue(e.account.firstName);
      }
      if(e.account.firstName !== undefined){
        this.phoneNumber.setValue(e.account.personalInfo.phone);
      }
      })
      
    });
    this.utilsService._dataOfAccountDetails.subscribe((dataAccount:any) => {
      if(dataAccount !== null){
        console.log('new Account DataDetails !: ',dataAccount.userDetails)
        // this.familyName = dataAccount.userDetails.familyName;
        // this.firstName = dataAccount.userDetails.firstName;
        // this.phoneNumber = dataAccount.userDetails.personalInfo.phone;
      }
    });
  }

  onchangepassword( event:any){
    // console.log('on change',  this.form.get('password').errors?.pattern, this.form.get('samepassword').errors?.pattern)
    // console.log(event.target.value)
  }


  confirmPassWord(){
    if(this.containsSpecial(this.form.get('password').value) == false){
      this.error = 'Doit contenir un caractere spécial';
      setTimeout(() => { this.error = ''; }, 1000);
    }
    if(this.containsmaj(this.form.get('password').value) == false){
      this.error = 'Doit contenir une majuscule';
      setTimeout(() => { this.error = '';}, 1000);
    }
    if(this.containsNumbers(this.form.get('password').value) == false){
      this.error = 'Doit contenir un nombre';
      setTimeout(() => { this.error = ''; }, 1000);
    }
    if(this.form.get('password').value.length < 8){
      this.error = 'Doit être supérieur à 8 caracteres';
      setTimeout(() => { this.error = ''; }, 1000);
    }
    if(this.form.get('password').value !== this.form.get('samepassword').value){
    
      console.log('NOT THE SAME', this.form.get('password').value,  this.form.get('samepassword').value)
      this.error = 'Les mots de passes ne sont pas identiques';
      setTimeout(() => { this.error = ''; }, 1000); 
    }else{
      if(this.error === ''){
        console.log(this.firstName, this.familyName, this.phoneNumber)
        console.log( this.form.get('password').value,  this.form.get('samepassword').value)
        this.code = this.route.snapshot.queryParams['oobCode'];
        // this.email = this.route.snapshot.queryParams['email'];
        console.log('LE EMAIL :: ! ',this.email, this.code);
        if(this.email !== ""){
          const authorizationValue = 'Basic ' + Buffer.from( this.email + ':' + this.form.get('password').value ).toString('base64');
          console.log('Le auth:!', authorizationValue)
          if(this.familyName.value !== "" && this.firstName.value !== ""){
            console.log(this.firstName.value, this.familyName, this.phoneNumber)
            this.account.firstName = this.firstName.value
            this.account.familyName = this.familyName.value
            this.account.personalInfo.phone = this.phoneNumber.value
            this.userHandlersServiceCustomer.updateAccount(this.account).then((resp:any)=>{
              resp.subscribe((response:any)=>{
                console.log('la resp du update user owner: ! ', response)
              })
            });
        
          }

          // Let save passwordHash with API function
          // this.userHandlersServiceCustomer.updateAccount(ProfilAccount).then((resp:any)=>{
          //   resp.subscribe((response:any)=>{
          //     console.log('la resp du update user: ! ', response.account)
          //   })
          // })

          this.userHandlersServiceCustomer.setPasswordHash(this.email, authorizationValue);
          
          
          this.router.navigate(['dashboard']);
        }

        // if( this.code !== undefined){
        //   this.Auth.confirmPasswordReset(this.code, this.form.get('password').value).then(() => {
        //     // Reset was successful
        //     console.log("Success");
          
        //   }).catch(error => { console.error(error) });
        // }
        // this.router.navigate(['dashboard']);
      }
    }
  }

onFormSubmit(){
  // this.router.navigate(['dashboard']);
}

onFormSubmitNavigate(){
  // window.location.href='https://drilllight.web.app/';
  // this.router.navigate(['dashboard']);
}


goToDashboard(){

}

containsSpecial(str:string){
  return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);
}

containsNumbers(str:string){
  return /[0-9]/.test(str);
}

containsmaj(str:string){
  return /[A-Z]/.test(str);
}

}
