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
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
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
    this.email = this.route.snapshot.queryParams['email'];
    console.log('id : ! ', this.email)
    if(this.id !== ""){
      // const authorizationValue = 'Basic ' + btoa( this.email + ':' + this.form.get('password').value );
      // console.log('Le auth:!', authorizationValue)
    }
    this.userHandlersServiceCustomer.getAccountDetails(this.email).then((resp:any)=>{
      resp.subscribe((e:any) =>{
      console.log('LE SUBSCRIBE DE LA REP In PASSWORD: ',e.account)
      this.account = e.account;
      this.email = e.account.email;
      console.log('ON GET LE MAIL : ! ',this.email)
      })
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
      setTimeout(() => { this.error = ''; }, 2000); 
    }else{
      if(this.error === ''){

        console.log( this.form.get('password').value,  this.form.get('samepassword').value)
        console.log('LE EMAIL :: ! ',this.email, this.code);
        if(this.email !== ""){
          const authorizationValue = 'Basic ' + Buffer.from( this.email + ':' + this.form.get('password').value ).toString('base64');
          console.log('Le auth:!', authorizationValue)
          this.userHandlersServiceCustomer.setPasswordHash(this.email, authorizationValue);
          this.router.navigate(['dashboard']);
        }
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
