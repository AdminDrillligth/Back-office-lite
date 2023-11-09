import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}/;
  contactFor:any[] = ["Demande d'accompagnement", "Demande Technique", "Création d'Exercices", "Autre"]
  reasonOfContact = '';
  form:any;
  @Input() name: string = '';
  
  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
      samepassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)])
    });
  }


  ngOnInit(): void {

  }

  onchangepassword(numb:number, event:any){
    if(numb === 0){
      console.log(event.target.value)
    }else{
      //confirm
      console.log(event.target.value)
    }
  }

  selectChangeReason(event:any){
    console.log(event, this.form.get('password').errors)

  }

  // const password: string = control.get('password').value; // get password from our password form control
  // const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
  // // compare is the password math
  // if (password !== confirmPassword) {
  //   // if they don't match, set an error in our confirmPassword form control
  //   control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
  // }
  onFormSubmit(){

  }
}
