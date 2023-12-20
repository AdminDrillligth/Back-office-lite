import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}/;
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  passwordConfirmFormControl = new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]);
  form:any;
  error:string='';
  code:any;
  constructor(private fb: FormBuilder, private Auth:AngularFireAuth, private route : ActivatedRoute){
    this.form = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      samepassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)])
    });
  }


  ngOnInit(): void {

  }

  onchangepassword( event:any){
    console.log('on change',  this.form.get('password').errors?.pattern, this.form.get('samepassword').errors?.pattern)
    console.log(event.target.value)
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
      // this.Auth.
      this.code = this.route.snapshot.queryParams['oobCode'];
      console.log(this.code);
    }
  }
  }
  onFormSubmit(){

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
