import { Injectable, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';

@Component({
  selector: 'app-exercices-categories',
  templateUrl: './exercices-categories.component.html',
  styleUrls: ['./exercices-categories.component.scss']
})
export class ExercicesCategoriesComponent {
  categorys = [{id:0,name:'Pré-formation'},{ id:1,name:'Formation'}, {id:2,name:'Seniors'}];
  ages_categorys = [{id:0, name:'U7'},{id:1, name:'U9'},{id:2, name:'U11'},{id:3, name:'U13'},{id:4, name:'U15'}, {id:5, name:'U17'},{id:6, name:'U18'},{id:7, name:'U19'},{id:8, name:'Seniors'}];

  constructor(
    private stepsService:StepsServiceService,
    private utilsService: UtilsService,
    private router: Router )
    {

    }

  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
    });
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER EXERCICES EDITO :! : ', AccountOfUser);
  }
}
