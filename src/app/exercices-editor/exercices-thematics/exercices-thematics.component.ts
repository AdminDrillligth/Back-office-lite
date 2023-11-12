import { Injectable, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';

@Component({
  selector: 'app-exercices-thematics',
  templateUrl: './exercices-thematics.component.html',
  styleUrls: ['./exercices-thematics.component.scss']
})


export class ExercicesThematicsComponent {
  // Thematics 
  thematics = [
    {id:0, name:'Tactique', class:'tactique', select:false, delete:false},
    {id:1, name:'Technique', class:'technique', select:false, delete:false},
    {id:2, name:'Physique', class:'physique', select:false , delete:false},
    {id:3, name:'Échauffement', class:'echauffement', select:false , delete:false},
    {id:4, name:'Finition', class:'finition', select:false , delete:false},
    {id:5, name:'Prise d’informations', class:'infotmations', select:false, delete:false},
    {id:6, name:'Endurance', class:'endurance', select:false, delete:false},
    {id:7, name:'Passe', class:'passe', select:false , delete:false},
    {id:8, name:'Frappe', class:'frappe', select:false, delete:false},
    {id:9, name:'Dribbble', class:'dribble', select:false , delete:false},
    {id:10, name:'Jongle', class:'jongle', select:false, delete:false},
    {id:11, name:'Conduite de balle', class:'contuite', select:false, delete:false},
    {id:12, name:'Spécifique attaquant', class:'attaquant', select:false, delete:false},
    {id:13, name:'Spécifique défenseur', class:'defenseur', select:false, delete:false},
    {id:14, name:'Spécifique milieu', class:'milieu', select:false, delete:false},
    {id:15, name:'Spécifique gardien', class:'gardien', select:false, delete:false},
    // {id:16, name:'Autre', class:'autre', select:false}
  ];

  other = {id:16, name:'Autre', class:'other', others:[], select:false}
  constructor(
    private stepsService:StepsServiceService,
    private utilsService: UtilsService,
    private router: Router ){}

  ngOnInit(): void {

  }

  selectTehematics(item:any){
    this.thematics.forEach((itemeach:any) =>{
      if(itemeach.class === item.class){
        if(itemeach.select == false){
          itemeach.select = true
        }else{
          itemeach.select = false
        }
      }
    });
    console.log(this.thematics)
  }

  addOther(){
    if(this.other.select == false){
      this.other.select = true
    }else{
      this.other.select = false
    }
    console.log(this.other)
  }

  addToThematiks(themevalue:any){
    this.other.select = false;
    let themeclass = themevalue.split(' ').join('').toLowerCase();
    this.thematics.push({id:this.thematics.length, name:themevalue, class:themeclass, select:true, delete:true})
  }
}
