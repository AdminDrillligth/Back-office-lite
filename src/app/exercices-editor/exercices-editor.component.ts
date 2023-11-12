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
      this.stepNumber = 1;

    }
  headerTitle: string = '';
  stepService: any[]= [];
  stepNumber: number = 1;
  ngOnInit(): void {
    this.stepNumber = 1;
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER EXERCICES EDITO :! : ', AccountOfUser);
    this.router.navigate(['exercices-editor/exercices-details']);
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
    });
    this.stepsService._stepNumberBase.subscribe((step:number) => {
      console.log('STEP NUMBER !: ',step)
      this.stepNumber = step;
      if(this.stepNumber === 1 ){
        this.router.navigate(['exercices-editor/exercices-details']);
      }
      if(this.stepNumber === 2 ){
        this.router.navigate(['exercices-editor/exercices-sport-select']);
      }
      if(this.stepNumber === 3 ){
        this.router.navigate(['exercices-editor/exercices-thematics']);
      }
      if(this.stepNumber === 4 ){
        this.router.navigate(['exercices-editor/exercices-categories']);
      }
      if(this.stepNumber === 5 ){
        this.router.navigate(['exercices-editor/exercices-drawer']);
      }
    });
    this.stepsService._titleOfexercice.subscribe((title:string) => {
      console.log('TITLE : !  !: ',title)
      this.headerTitle = title;
    });


  }




  goTOcreate(){
    
  }

  previousStep(){
    if(this.stepNumber <=1){
      this.stepNumber = 1;
    }
    const btnPrevious = document.querySelector<HTMLElement>('.outline-btn-previous');
    if (btnPrevious != null) {
      btnPrevious.style.backgroundColor = '#ff4081';
      setTimeout(() => {
        btnPrevious.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      }, 1000);
   
    }
    this.stepsService.substractChangeNumberOfStep(this.stepNumber-1) 
  }

  nextStep(){
    const btnNext = document.querySelector<HTMLElement>('.outline-btn-next');
    if (btnNext != null) {
      btnNext.style.backgroundColor = '#ff4081';
      setTimeout(() => {
        btnNext.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      }, 1000);
   
    }


    this.stepsService.addChangeNumberOfStep(this.stepNumber+1)    
  }
}
