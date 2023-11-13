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
  categorys = [
    { id:0,name:'Pré-formation', class:'preform', select:false},
    { id:1,name:'Formation', class:'form', select:false},
    { id:2,name:'Seniors' , class:'seniors', select:false}];
  ages_categorys = [
    {id:0, name:'U7', class:'u7', select:false},
    {id:1, name:'U9', class:'u9', select:false},
    {id:2, name:'U11', class:'u11', select:false},
    {id:3, name:'U13', class:'u13', select:false},
    {id:4, name:'U15', class:'u15', select:false},
    {id:5, name:'U17', class:'u17', select:false},
    {id:6, name:'U18', class:'u18', select:false},
    {id:7, name:'U19', class:'u19', select:false},
    {id:8, name:'Seniors', class:'senior', select:false}];

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
  selectCategories(item:any){
    this.categorys.forEach((itemeach:any) =>{
      if(itemeach.class === item.class){
        if(itemeach.select == false){
          itemeach.select = true
        }else{
          itemeach.select = false
        }
      }
    });
    console.log(this.categorys)
  }

  selectAgeCategories(item:any){
    this.ages_categorys.forEach((itemeach:any) =>{
      if(itemeach.class === item.class){
        if(itemeach.select == false){
          itemeach.select = true
        }else{
          itemeach.select = false
        }
      }
    });
    console.log(this.ages_categorys)
  }
}
