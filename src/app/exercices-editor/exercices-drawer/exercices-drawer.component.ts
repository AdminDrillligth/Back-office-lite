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
    {name:'Conception', select:false, src:'../../../assets/icons/exercices/interface/reverse-left.svg'},
    {name:'Animation', select:false , src:'../../../assets/icons/exercices/interface/reverse-right.svg'},
  ];
  zoom = 10;
  ZOOM_SPEED = 0.5;
  @HostListener('wheel', ['$event'])
  onMouseWheel(event:any) {

    // console.log('mouse wheel ',event, event.deltaY)
    if(event.srcElement !== null){
      if(event.srcElement.attributes[1].nodeValue === 'fields-container'){
        let zoomElement = document.querySelector<HTMLElement>(".fields-container");
        event.preventDefault();
        event.stopPropagation();
        // console.log('CLASSNAME :: ',event.srcElement.attributes[1].nodeValue)
        if(event.deltaY > 0){
          console.log(event.deltaY)
          if(zoomElement !== null){
           if(this.zoom - this.ZOOM_SPEED >= 6){
              zoomElement.style.transform = `scale(${this.zoom -= this.ZOOM_SPEED})`;
              console.log('ZOOM OUT', this.zoom - this.ZOOM_SPEED)
              this.scale = `scale(${Math.round(this.zoom -= this.ZOOM_SPEED)})`;
            }
           
           
          }
           
        }else{
          console.log(event.deltaY)
          if(zoomElement !== null){
            zoomElement.style.transform = `scale(${this.zoom += this.ZOOM_SPEED})`;
            console.log('ZOOM IN',this.zoom + this.ZOOM_SPEED)
            this.scale = `scale(${Math.round(this.zoom += this.ZOOM_SPEED)})`;
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
    // console.log('LA HAUTEUR :: ! ',window.innerHeight/3.2)
    // this.heightContainer   = window.innerHeight/3.2;
  }
  heightContainer = 0;

  ngOnChanges(){
  }

  addEcones(){
    this.econes.push(
      {
        name:'Econe'+(Number(this.econes.length)+1), 
        number:this.econes.length+1, 
        transform:'scale(0.08)', 
        active:false,
        topactif:false,
        bottomactif:false,
        leftactif:false,
        rightactif:false
      }
    )
    console.log('LES ECONES : ! ! ',this.econes)
  }

  displayUtils(artefact:any){
    let Element = document.querySelector<HTMLElement>("."+artefact.name);
    let ElementAll = document.querySelectorAll("."+artefact.name);
    if(Element !== null){
      console.log(Element, Element.offsetLeft, ElementAll)
    }
  
    if(artefact.active == true){
      artefact.active = false;
    }else{
      artefact.active = true;
    }
    
  }

  selectTopDrawer(econe:any){
    console.log('select top drawer', econe)
    econe.topactif = true;
  }

  pinchIn(event:any){
    // console.log('onpoinchIN !!! ',event)
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    // console.log('CLASSNAME :: ',event.srcElement.attributes[1].nodeValue)
      console.log(event.deltaY)            
      if(zoomElement !== null){ 
          zoomElement.style.transform = `scale(${this.zoom += 0.1})`;
          this.scale = `scale(${Math.round(this.zoom += 0.1)})`;
          console.log('ZOOM IN', this.zoom - 0.1)
       
       
    }
  }

  pinchOut(event:any){
    // console.log('onpoinchOUT !!! ',event)
    // if(event.srcElement.attributes[1].nodeValue === 'fields-container'){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
      // console.log('CLASSNAME :: ',event.srcElement.attributes[1].nodeValue)
        console.log(event.deltaY)            
        if(zoomElement !== null){ 
         if(this.zoom - this.ZOOM_SPEED >= 6){
            zoomElement.style.transform = `scale(${this.zoom -= 0.1})`;
            this.scale = `scale(${Math.round(this.zoom -= 0.1)})`;
            console.log('ZOOM OUT', this.zoom - 0.1)
          }
         
         
      }
    // }
  }
  scale= 'scale(10.5)';
  xgo = 0;
  ygo = 0;

  swipeEventRight(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    let zoomElementAll = document.querySelectorAll(".fields-container");
    this.xgo = this.xgo + 3;
    this.ygo = this.ygo;
    let newtranslate = "translate3d("+Math.round(this.xgo)+"px,"+Math.round(this.ygo)+"px,0px)";
    if(zoomElement !== null){
      console.log('we swipe Right:', event, event.distance, zoomElement.style, zoomElementAll)
      console.log(zoomElement.style.transform, newtranslate, this.scale)
      zoomElement.style.transform = this.scale + newtranslate;
    }
    
    
  }


  swipeEventLeft(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    // console.log('we swipe Left:', event, event.distance)
    // let newtranslate = "translate3d("+xgo+"px,"+ygo+"px,0px)";
    this.xgo = this.xgo - 3;
    this.ygo = this.ygo;
    let newtranslate = "translate3d("+Math.round(this.xgo)+"px,"+Math.round(this.ygo)+"px,0px)";
    if(zoomElement !== null){
      console.log('we swipe left:', event, event.distance, zoomElement)
      // console.log('we swipe Right:', event, event.distance, zoomElement.style, zoomElementAll)
      console.log(zoomElement.style.transform, newtranslate, this.scale)
      zoomElement.style.transform = this.scale + newtranslate;
    //   zoomElement.style.transform = 
    }
  }

  
  swipeEventUp(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    this.xgo = this.xgo ;
    this.ygo = this.ygo + 3;
    let newtranslate = "translate3d("+Math.round(this.xgo)+"px,"+Math.round(this.ygo)+"px,0px)";
    if(zoomElement !== null){
      console.log('we swipe Right:', event, event.distance, zoomElement)
      zoomElement.style.transform = this.scale + newtranslate;
    }
  }

  swipeEventDown(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    this.xgo = this.xgo ;
    this.ygo = this.ygo - 3;
    let newtranslate = "translate3d("+Math.round(this.xgo)+"px,"+Math.round(this.ygo)+"px,0px)";
    if(zoomElement !== null){
      console.log('we swipe Right:', event, event.distance, zoomElement)
      zoomElement.style.transform = this.scale + newtranslate;
    }
  }

  addActor(){
    this.actors.push(
      {
        name:'Actor'+(Number(this.econes.length)+1), 
        number:this.actors.length+1,
        active:false,
        topactif:false,
        bottomactif:false,
        leftactif:false,
        rightactif:false
      }
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

  changePlaceItem(event:any,econe:any){
    console.log('PLACE',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    if(zoomElement !== null){
      console.log(zoomElement.style.transform)
      // zoomElement.style.transform = 'scale(0.08) translate3d(0px, 0px, 0px)';
    }
  }

  getStartMoove(event:any,econe:any){
    console.log('START',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    if(zoomElement !== null){
      // zoomElement.style.transform = 'scale(0.08) translate3d('+event.distance.x+'px,'+event.distance.y+'px, 0px)';
    }
  }

  getEndMoove(event:any,econe:any){
    console.log('END',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    if(zoomElement !== null){
      // zoomElement.style.transform = 'scale(0.08) translate3d('+event.distance.x+'px, -9px, 0px)';
    }
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
