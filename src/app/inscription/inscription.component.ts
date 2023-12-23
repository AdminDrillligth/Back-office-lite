import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}/;
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  passwordConfirmFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  form:any;
  error:string='';
  emailParams:any;
  seeChangePage = false;
  // email = new FormControl('', [Validators.required]);
  constructor(private router:Router,private fb: FormBuilder, private Auth:AngularFireAuth, private route : ActivatedRoute){
    this.form = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      samepassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      email : new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    setTimeout(() =>{
      // this.emailParams = ;
      // console.log(this.emailParams)
      // this.email = this.emailParams;
      this.form.controls['email'].setValue(this.route.snapshot.queryParams['email']);
      // this.form.  = this.emailParams
    },500)
  }

  onchangepassword( event:any){

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
        console.log( this.form.get('password').value,  this.form.get('samepassword').value)
        this.seeChangePage = true;
      }
    }
  }

  onFormSubmit(){
    this.emailParams = this.route.snapshot.queryParams['email'];
    console.log(this.emailParams)
    // window.location.href='https://drilllight.web.app/'
  }

  goToDashboard(){
    this.router.navigate(['login']);
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
