import {  Component, OnInit, Inject } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../services/steps-service.service';

@Component({
  selector: 'app-exercices-editor',
  templateUrl: './exercices-editor.component.html',
  styleUrls: ['./exercices-editor.component.scss']
})


export class ExercicesEditorComponent {
  constructor(
    private stepsService:StepsServiceService,
    private utilsService: UtilsService,
    private router: Router )
    {

    }
  headerTitle: string = '';
  stepService: any[]= [];
  stepNumber: number = 1;
  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
    });
    this.stepsService._stepNumberBase.subscribe((step:number) => {
      console.log('STEP NUMBER !: ',step)
      this.stepNumber = step;
    });
    this.stepsService._titleOfexercice.subscribe((title:string) => {
      console.log('TITLE : !  !: ',title)
      this.headerTitle = title;
    });
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER EXERCICES EDITO :! : ', AccountOfUser);
    this.router.navigate(['exercices-editor/exercices-details']);

  }

  goTOcreate(){
    
  }

  previousStep(){
    this.stepsService.substractChangeNumberOfStep(this.stepNumber-1) 
  }

  nextStep(){
    this.stepsService.addChangeNumberOfStep(this.stepNumber+1)    
  }
}
