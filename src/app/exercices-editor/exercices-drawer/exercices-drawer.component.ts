import { Injectable, Component, OnInit, Inject, ViewChild , OnChanges , HostListener  } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';

@Component({
  selector: 'app-exercices-drawer',
  templateUrl: './exercices-drawer.component.html',
  styleUrls: ['./exercices-drawer.component.scss']
})
export class ExercicesDrawerComponent implements OnInit, OnChanges {
  btnDrawer = [
    {name:'Conception', select:true},
    {name:'Animation', select:false},
  ];
  zoom = 10;
  ZOOM_SPEED = 0.5;
  @HostListener('wheel', ['$event'])
  onMouseWheel(event:any) {

    console.log('mouse wheel ',event, event.deltaY)
    if(event.srcElement !== null){
      if(event.srcElement.attributes[1].nodeValue === 'fields-container'){
        let zoomElement = document.querySelector<HTMLElement>(".fields-container");
        event.preventDefault();
        event.stopPropagation();
        console.log('CLASSNAME :: ',event.srcElement.attributes[1].nodeValue)
        if(event.deltaY > 0){
          console.log(event.deltaY)
          if(zoomElement !== null){
            zoomElement.style.transform = `scale(${this.zoom -= this.ZOOM_SPEED})`;
           
          }
           
        }else{
          console.log(event.deltaY)
          if(zoomElement !== null){
            zoomElement.style.transform = `scale(${this.zoom += this.ZOOM_SPEED})`;
          }
            
        }
      }
    }

  // do something with the mouse wheel event
  }
  hiddenNumb = true;
  hidden = false;
  listOfEquipments = [
    {id:0, name:'Ballon', class:'ballon', select:'false',  src:'../../../assets/icons/exercices/png/ball.png'},
    {id:1, name:'Plot', class:'plot', select:'false',  src:'../../../assets/icons/exercices/png/Plot.png'},
    {id:2, name:'Cerceaux', class:'cerceaux', select:'false',  src:'../../../assets/icons/exercices/png/ball.png'},
    {id:3, name:'Échelle', class:'echelle', select:'false',  src:'../../../assets/icons/exercices/png/ladder.png'},
    {id:4, name:'Coupelle', class:'coupelle', select:'false',  src:'../../../assets/icons/exercices/png/ball.png'},
    {id:5, name:'Drapeau', class:'drapeau', select:'false',  src:'../../../assets/icons/exercices/png/flag.png'},
    {id:6, name:'Rebounder', class:'rebounder', select:'false',  src:'../../../assets/icons/exercices/png/rebounder.png'},
    {id:7, name:'Mini haie', class:'minihaie', select:'false',  src:'../../../assets/icons/exercices/png/barrier.png'},
    {id:7, name:'Jalons', class:'jalon', select:'false',  src:'../../../assets/icons/exercices/png/ball.png'},
    {id:7, name:'Mannequin', class:'model', select:'false',  src:'../../../assets/icons/exercices/png/Actor.png'},
  ]
  selectedEquipments = [
    [{name:'', number:0}]
  ]
  btnAdderList : any[] = [];
  equipHidden = false;
  econes :any[]= [];
  actors :any[]= [];
  balls : any[]= [];
  plots: any[] =[];
  Cerceaux : any[] =[];
  Échelle : any[] =[];
  Coupelle : any[] =[];
  flags : any[] =[];
  rebounders : any[] =[];
  Mini : any[] =[];
  jalons : any[] =[];
  Mannequin : any[] =[];
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


  ngOnChanges(){
  }

  addEcones(){
    this.econes.push(
      {name:'Econe'+this.econes.length+1, number:this.econes.length+1}
    )
    console.log('LES ECONES : ! ! ',this.econes)
    // this.selectedEquipments.push(
    //   {name:'Econe', number}
    // );
  }

  pinchIn(){
    console.log('onpoinchIN !!! ')
  }

  pinchOut(){
    console.log('onpoinchOUT !!! ')
  }

  addActor(){
    this.actors.push(
      {name:'actor'+this.actors.length+1, number:this.actors.length+1}
    )
    console.log('LES ACTEURS : ! ! ',this.actors)
  }

  addEquip(item:any){
    console.log('LES ECONES : ! ! ',item.name)
    if(item.name === 'Ballon'){
      this.balls.push(
        {name:'actor'+this.balls.length+1, number:this.balls.length+1}
      )
    }
    if(item.name === 'Plot'){
      this.plots.push(
        {name:'plot'+this.plots.length+1, number:this.plots.length+1}
      )
    }
    if(item.name === 'Drapeau'){
      this.flags.push(
        {name:'flag'+this.plots.length+1, number:this.flags.length+1}
      )
    }
    if(item.name === 'Rebounder'){
      this.rebounders.push(
        {name:'rebounder'+this.plots.length+1, number:this.rebounders.length+1}
      )
    }
    if(item.name === 'Jalons'){
      this.jalons.push(
        {name:'jalon'+this.plots.length+1, number:this.jalons.length+1}
      )
    }

    // console.log('LES PLOTS : ! ! ',this.plots)
  }

  addElementEquipment(item:any){
    this.equipHidden = false;
    console.log(item)
    if(item.name === 'Plot'){
      this.btnAdderList.push(
        {name:'Plot', src:'../../../assets/icons/exercices/png/Plot.png', array:this.plots}
      )
    }
    if(item.name === 'Ballon'){
      this.btnAdderList.push(
        {name:'Ballon', src:'../../../assets/icons/exercices/png/ball.png', array:this.balls}
      )
    }
    if(item.name === 'Drapeau'){
      this.btnAdderList.push(
        {name:'Drapeau', src:'../../../assets/icons/exercices/png/flag.png', array:this.flags}
      )
    }
    if(item.name === 'Rebounder'){
      this.btnAdderList.push(
        {name:'Rebounder', src:'../../../assets/icons/exercices/png/rebounder.png', array:this.rebounders}
      )
    }
    if(item.name === 'Jalons'){
      this.btnAdderList.push(
        {name:'Jalons', src:'../../../assets/icons/exercices/png/ball.png', array:this.jalons}
      )
    }
// Cerceaux
// Échelle
// Coupelle
// Mini
// Mannequin
  }

  addElement(){
    this.equipHidden = true;
  }

  changeNavConceptionNavigation(btnChoose:any){
    this.btnDrawer.forEach(btn =>{
      if(btn.name === btnChoose.name){
        if(btn.select == false){
          btn.select = true
        }else{
          btn.select = false
        }
      }else{
        if(btn.select == false){
          btn.select = true
        }else{
          btn.select = false
        }
      }
    })
  }

}
