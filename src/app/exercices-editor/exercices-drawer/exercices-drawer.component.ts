import { Injectable, Component, OnInit, Inject, ViewChild , OnChanges , HostListener, ElementRef  } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';
import 'leader-line';
declare var LeaderLine: any;
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

  @ViewChild('connection-canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

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
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('EVENT KEYBOARD : ! ',event);
    if(event.key == 'ArrowDown'){
      // Your row selection code
      console.log('ON DOWN : ',event.key);
    }
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
        rightactif:false,
        // allfalse:true;
      }
    )
    console.log('LES ECONES : ! ! ',this.econes)
  }

  // CANVAS DISPLAY 
  lastSelection:any;
  // p1, p2
  line:any
  drawLine() {

    const startingElement = document.querySelector('#Econe1');
    const endingElement = document.querySelector('#Econe2');
    console.log('love je reussi ')
    // New leader line has red color and size 8.
    this.line = new LeaderLine(startingElement, endingElement);
    // https://stackoverflow.com/questions/39685298/draw-a-line-between-2-divs-once-2-consequence-div-clicked-using-angularjs
  //   const canvas = document.getElementById('connection-canvas') as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');
    
  // //   var canvas = document.getElementById("connection-canvas");
  //    if(this.canvas !== null){
  //     if(ctx !== null){
  //       console.log('we gonna draw', ctx)
  //       //  var ctx = this.canvas.getContext("2d");
  //       // ctx.beginPath();
  //       // // this.selector[0].x
  //       //      ctx.moveTo(this.selector[0].p1x, this.selector[0].p1y);
  //       //      ctx.lineTo(this.selector[1].p2x, this.selector[1].p2y);
  //       //      ctx.stroke();

  //            ctx.rect(10, 10, 150, 100);
  //           ctx.stroke();
  //     }

  //    }
  }

  displayUtils(artefact:any){
    let Element = document.querySelector<HTMLElement>("."+artefact.name);
    let ElementAll = document.querySelectorAll("."+artefact.name);
    if(Element !== null){
      console.log(Element, Element.offsetLeft, ElementAll)
    }
  
    if(artefact.active == true){
      artefact.active = false;
      artefact.topactif = false;
      artefact.bottomactif = false;
      artefact.leftactif = false;
      artefact.rightactif = false;

    }else{
      artefact.active = true;
    }
    
  }


  selector:any=[]
  selectTopDrawer(artefact:any){
    console.log('select top drawer', artefact)
    let topPointSelect = document.querySelector<HTMLElement>(".top"+artefact.name);
    if(topPointSelect !== null){
      console.log(topPointSelect.getBoundingClientRect().x, topPointSelect.getBoundingClientRect().y)
      if(this.selector.length === 0){
        this.selector.push({artefact:artefact, p1x:topPointSelect.getBoundingClientRect().x, p1y:topPointSelect.getBoundingClientRect().y})
 
      }else{
        this.selector.push({artefact:artefact, p2x:topPointSelect.getBoundingClientRect().x, p2y:topPointSelect.getBoundingClientRect().y})
 
      }
    }
    console.log('le selecteur', this.selector)
    setTimeout(() => {
      if(artefact.topactif == true){
        artefact.topactif = false;
      }else{
        artefact.leftactif = false;
        artefact.rightactif = false;
        artefact.bottomactif = false;
        artefact.topactif = true;
        artefact.active = true;
      }
      console.log('select top drawer', artefact)
    }, 500);
  }

  selectBottomDrawer(artefact:any){
    console.log('select top drawer 1', artefact)
    let bottomPointSelect = document.querySelector<HTMLElement>(".bottom"+artefact.name);
    if(bottomPointSelect !== null){
      console.log(bottomPointSelect.getBoundingClientRect())
      if(this.selector.length === 0){
        this.selector.push({artefact:artefact, p1x:bottomPointSelect.getBoundingClientRect().x, p1y:bottomPointSelect.getBoundingClientRect().y})
 
      }else{
        this.selector.push({artefact:artefact, p2x:bottomPointSelect.getBoundingClientRect().x, p2y:bottomPointSelect.getBoundingClientRect().y})
        if(this.selector.length === 2){
          this.drawLine()
        }
      }
    }
    console.log('le selecteur', this.selector)
    setTimeout(() => {
      if(artefact.bottomactif == false){
        artefact.leftactif = false;
        artefact.rightactif = false;
        artefact.bottomactif = true;
        artefact.topactif = false;
        artefact.active = true;
        console.log('false')
      }else if(artefact.bottomactif == true){
        console.log('true')
        artefact.bottomactif = false;
      }
      console.log('select Bottom drawer 2', artefact)
    }, 500);
  }

  selectRightDrawer(artefact:any){
    console.log('select top drawer', artefact)
    let rightPointSelect = document.querySelector<HTMLElement>(".bottom"+artefact.name);
    if(rightPointSelect !== null){
      console.log(rightPointSelect.getBoundingClientRect())
    }
    setTimeout(() => {
      if(artefact.rightactif == true){
        artefact.rightactif = false;
      }else{
        artefact.leftactif = false;
        artefact.rightactif = true;
        artefact.bottomactif = false;
        artefact.topactif = false;
        artefact.active = true;
      }
      console.log('select Right drawer', artefact)
    }, 500);
  }

  selectLeftDrawer(artefact:any){
    console.log('select top drawer', artefact)
    let leftPointSelect = document.querySelector<HTMLElement>(".bottom"+artefact.name);
    if(leftPointSelect !== null){
      console.log(leftPointSelect.getBoundingClientRect())
    }
    setTimeout(() => {
      if(artefact.leftactif == true){
        artefact.leftactif = false;
      }else{
        artefact.leftactif = true;
        artefact.rightactif = false;
        artefact.bottomactif = false;
        artefact.topactif = false;
        artefact.active = true;
      }
     
      console.log('select Right drawer', artefact)
    }, 500);
  }

  drawLineBetween(){
    
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
    this.line.remove()
    if(zoomElement !== null){
      // zoomElement.style.transform = 'scale(0.08) translate3d('+event.distance.x+'px,'+event.distance.y+'px, 0px)';
    }
  }

  getEndMoove(event:any,econe:any){
    console.log('END',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    

    this.drawLine()
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
