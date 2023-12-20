import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';

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

    
  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      samepassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)])
    });
  }


  ngOnInit(): void {

  }

  onchangepassword( event:any){
    console.log('on change')
    console.log(event.target.value)
    
  }


  confirmPassWord(){
    console.log(this.passwordFormControl, this.passwordConfirmFormControl)
  }
  onFormSubmit(){

  }
}
