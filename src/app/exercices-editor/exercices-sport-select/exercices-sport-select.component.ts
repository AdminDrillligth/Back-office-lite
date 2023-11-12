import { Injectable, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';


@Component({
  selector: 'app-exercices-sport-select',
  templateUrl: './exercices-sport-select.component.html',
  styleUrls: ['./exercices-sport-select.component.scss']
})
export class ExercicesSportSelectComponent {
  fieldsArray = [
    { select:false, src:'../../../assets/icons/fields/football.png', title:'Football', class:'football'},
    { select:false, src:'../../../assets/icons/fields/rugby.png', title:'Rugby', class:'rugby'},
    { select:false, src:'../../../assets/icons/fields/tennis.png', title:'Tennis' , class:'tennis'},
    { select:false, src:'../../../assets/icons/fields/athletisme.png', title:'Piste d’athlétisme', class:'piste'},
    { select:false, src:'../../../assets/icons/fields/basket.png', title:'Basket', class:'basket'},
    { select:false, src:'../../../assets/icons/fields/handball.png', title:'Handball' , class:'handball'},
    { select:false, src:'../../../assets/icons/fields/volley.png', title:'Volley' , class:'volley'},
    { select:false, src:'../../../assets/icons/fields/custom.png', title:'Surface personnalisée', class:'surface'}
  ]
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

  selectItem(item:any){
   
    
    this.fieldsArray.forEach(item =>{
      item.select = false;
    });
    item.select = true;
    console.log(this.fieldsArray)
  }

}
