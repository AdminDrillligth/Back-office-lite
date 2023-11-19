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
    {name:'back', select:false, src:'../../../assets/icons/exercices/interface/reverse-left.svg'},
    {name:'next', select:false , src:'../../../assets/icons/exercices/interface/reverse-right.svg'},
  ];

  historical:any[]=[];
  @ViewChild('connection-canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  zoom = 10;
  ZOOM_SPEED = 0.5;
  @HostListener('wheel', ['$event'])
  onMouseWheel(event:any) {
    if(event.srcElement !== null){
      if(event.srcElement.attributes[1].nodeValue === 'fields-container'){
        let zoomElement = document.querySelector<HTMLElement>(".fields-container");
        event.preventDefault();
        event.stopPropagation();
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
    if(event.key == 'ArrowUp'){
      // Your row selection code
      console.log('ON UP : ',event.key);
    }
    if(event.key == 'ArrowLeft'){
      // Your row selection code
      console.log('ON LEFT : ',event.key);
    }
    if(event.key == 'ArrowRight'){
      // Your row selection code
      console.log('ON RIGHT : ',event.key);
    }
  }

  hiddenNumb = true;
  hidden = false;
  listOfEquipments = [
    {id:0, name:'Ballon', class:'ballon', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-ball.svg',total:0},
    {id:1, name:'Plot', class:'plot', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-plot.svg',total:0},
    {id:2, name:'Goal', class:'goal', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-goal.svg',total:0},
    {id:3, name:'Echelle', class:'echelle', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-ladder.svg',total:0},
    // {id:4, name:'Coupelle', class:'coupelle', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-ball.svg'},
    {id:5, name:'Drapeau', class:'drapeau', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-flag.svg',total:0},
    {id:6, name:'Rebounder', class:'rebounder', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-rebounder.svg',total:0},
    {id:7, name:'Minihaie', class:'minihaie', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-barrier.svg',total:0},
    {id:8, name:'Marker', class:'marker', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-marker.svg',total:0},
    {id:9, name:'Mannequin', class:'model', select:'false',  src:'../../../assets/icons/exercices/interface/Equipement-player.svg',total:0},
  ]

  listOfEquipmentsPrinciple = [];
  selectedEquipments = [[{name:'', number:0}]];
  btnAdderList : any[] = [];
  equipHidden = false;
  econes :any[]= [];
  actors :any[]= [];
  players :any[]= [];
  markers:any[]= [];
  goals : any[] = [];
  balls : any[]= [];
  ladders: any[]= [];
  plots: any[] =[];
  Cerceaux : any[] =[];
  Échelle : any[] =[];
  Coupelle : any[] =[];
  flags : any[] =[];
  rebounders : any[] =[];
  minihaies : any[] =[];
  jalons : any[] =[];
  Mannequin : any[] =[];

  lines: any[] = [];
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
        classColor:'',
        action:'',
        stepTotal:''
      }
    )
    console.log('LES ECONES : ! ! ',this.econes)
  }

  // CANVAS DISPLAY 
  lastSelection:any;
  line:any
  drawLine() {


    const startingElement = document.querySelector('#Econe1');
    const endingElement = document.querySelector('#Econe2');
    console.log('love je reussi ') 
    this.line = new LeaderLine(startingElement, endingElement);
    this.line.size = 1;
    this.line.color = 'grey';
    this.line.path = 'fluid';
    this.line.setOptions({
      startPlug: 'disc',
      endPlug: 'arrow3'
    });
  }

  drawLines(){
    // Here draw and redraw all lines
    if(this.lines.length !== 0){
      this.lines.forEach(line => {
        console.log('DRAW LINES : ',line)
      })
    }
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
    let selector = document.querySelector(".top"+artefact.name);
    if(topPointSelect !== null){
      console.log(topPointSelect.getBoundingClientRect().x, topPointSelect.getBoundingClientRect().y)
      if(this.selector.length < 2){
        if(this.selector.length === 0){
          this.selector.push({selector: selector,artefact:artefact, p1x:topPointSelect.getBoundingClientRect().x, p1y:topPointSelect.getBoundingClientRect().y})
   
        }else{
          this.selector.push({selector: selector,artefact:artefact, p2x:topPointSelect.getBoundingClientRect().x, p2y:topPointSelect.getBoundingClientRect().y})
          // this.drawLine()   
        }
      }else{
        this.lines.push({points:this.selector})
        this.selector.length = 0;
        this.selector.push({selector: selector,artefact:artefact, p1x:topPointSelect.getBoundingClientRect().x, p1y:topPointSelect.getBoundingClientRect().y})
      }


    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
    setTimeout(() => {
      if(artefact.topactif == true){
         artefact.topactif = false;
         return;
      }else{
        artefact.leftactif = false;
        artefact.rightactif = false;
        artefact.bottomactif = false;
        artefact.topactif = true;
        artefact.active = true;
        return;
      }
      console.log('select top drawer', artefact)
    }, 500);
  }

  selectBottomDrawer(artefact:any){
    console.log('select top drawer 1', artefact)
    let bottomPointSelect = document.querySelector<HTMLElement>(".bottom"+artefact.name);
    let selector = document.querySelector(".bottom"+artefact.name);
    if(bottomPointSelect !== null){
      console.log(bottomPointSelect.getBoundingClientRect())
      if(this.selector.length <2){
        if(this.selector.length === 0){
          this.selector.push({selector: selector,artefact:artefact, p1x:bottomPointSelect.getBoundingClientRect().x, p1y:bottomPointSelect.getBoundingClientRect().y})
   
        }else{
          this.selector.push({selector: selector,artefact:artefact, p2x:bottomPointSelect.getBoundingClientRect().x, p2y:bottomPointSelect.getBoundingClientRect().y})
        }
      }else{
        this.lines.push({points:this.selector})
        this.selector.length = 0;
        this.selector.push({selector: selector,artefact:artefact, p1x:bottomPointSelect.getBoundingClientRect().x, p1y:bottomPointSelect.getBoundingClientRect().y})
        
      }

    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
    setTimeout(() => {
      if(artefact.bottomactif == false){
        
        artefact.leftactif = false;
        artefact.rightactif = false;
        artefact.bottomactif = true;
        artefact.topactif = false;
        artefact.active = true;
        return;
        console.log('false')
      }else if(artefact.bottomactif == true){
        console.log('true')
        artefact.bottomactif = false;
        return;
      }
      console.log('select Bottom drawer 2', artefact)
    }, 500);
  }

  selectRightDrawer(artefact:any){
    console.log('select top drawer', artefact)
    let rightPointSelect = document.querySelector<HTMLElement>(".right"+artefact.name);
    let selector = document.querySelector(".right"+artefact.name);
    if(rightPointSelect !== null){
      console.log(rightPointSelect.getBoundingClientRect())
      if(this.selector.length <2){
        if(this.selector.length === 0){
          this.selector.push({selector: selector,artefact:artefact, p1x:rightPointSelect.getBoundingClientRect().x, p1y:rightPointSelect.getBoundingClientRect().y})
   
        }else{
          this.selector.push({selector: selector,artefact:artefact, p2x:rightPointSelect.getBoundingClientRect().x, p2y:rightPointSelect.getBoundingClientRect().y})
          if(this.selector.length === 2){
          }
        }
      }else{
        this.lines.push({points:this.selector})
        this.selector.length = 0;
        this.selector.push({selector: selector,artefact:artefact, p1x:rightPointSelect.getBoundingClientRect().x, p1y:rightPointSelect.getBoundingClientRect().y})
        
      }

    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
    setTimeout(() => {
      if(artefact.rightactif == true){
        artefact.rightactif = false;
        return;
      }else{
        artefact.leftactif = false;
        artefact.rightactif = true;
        artefact.bottomactif = false;
        artefact.topactif = false;
        artefact.active = true;
        return;
      }
      console.log('select Right drawer', artefact)
    }, 500);
  }

  selectLeftDrawer(artefact:any){
    console.log('select top drawer', artefact)
    let leftPointSelect = document.querySelector<HTMLElement>(".left"+artefact.name);
    let selector = document.querySelector(".left"+artefact.name);
    if(leftPointSelect !== null){
      console.log(leftPointSelect.getBoundingClientRect())
      if(this.selector.length <2){
        if(this.selector.length === 0){
          this.selector.push({selector: selector,artefact:artefact, p1x:leftPointSelect.getBoundingClientRect().x, p1y:leftPointSelect.getBoundingClientRect().y})
   
        }else{
          this.selector.push({selector: selector,artefact:artefact, p2x:leftPointSelect.getBoundingClientRect().x, p2y:leftPointSelect.getBoundingClientRect().y})
          if(this.selector.length === 2){
          }
        }
      }else{
        this.lines.push({points:this.selector})
        this.selector.length = 0;
        this.selector.push({selector: selector,artefact:artefact, p1x:leftPointSelect.getBoundingClientRect().x, p1y:leftPointSelect.getBoundingClientRect().y})
      }
    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
    
    setTimeout(() => {
      if(artefact.leftactif == true){
        artefact.leftactif = false;
        return;
      }else{
        artefact.leftactif = true;
        artefact.rightactif = false;
        artefact.bottomactif = false;
        artefact.topactif = false;
        artefact.active = true;
        return;
      }
     
      console.log('select Right drawer', artefact)
    }, 500);
  }


  pinchIn(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
      console.log(event.deltaY)            
      if(zoomElement !== null){ 
          zoomElement.style.transform = `scale(${this.zoom += 0.1})`;
          this.scale = `scale(${Math.round(this.zoom += 0.1)})`;
          console.log('ZOOM IN', this.zoom - 0.1)
       
       
    }
  }

  pinchOut(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
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
        rightactif:false,
        classColor:''
      }
    )
    console.log('LES ACTEURS : ! ! ',this.actors)
  }

  addElementEquipment(item:any){
    this.equipHidden = false;
    console.log('L`équipement choisi mon coeur je reussi nous reussissons  : ! ! ',item.name)
    this.listOfEquipments.forEach(equip =>{
      if(equip.name === item.name){
        equip.total = equip.total+1; 
      }
      
    })
    if(item.name === 'Ballon'){
      this.balls.push(
        {
          name:'ball'+(this.balls.length+1), 
          number:this.balls.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-ball.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Plot'){
      this.plots.push(
        {
          name:'plot'+(this.plots.length+1), 
          number:this.plots.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-plot.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Drapeau'){
      this.flags.push(
        {
          name:'flag'+(this.plots.length+1), 
          number:this.flags.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-flag.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Rebounder'){
      this.rebounders.push(
        {
          name:'rebounder'+(this.plots.length+1),
          number:this.rebounders.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-rebounder.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Player'){
      this.players.push(
        {
          name:'player'+(this.players.length+1), 
          number:this.players.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-player.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Goal'){
      this.goals.push(
        {
          name:'goal'+(this.goals.length+1), 
          number:this.goals.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-goal.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Echelle'){
      this.ladders.push(
        {
          name:'ladder'+(this.ladders.length+1), 
          number:this.ladders.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-ladder.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    if(item.name === 'Minihaie'){
      this.minihaies.push(
        {
          name:'minihaie'+(this.minihaies.length+1), 
          number:this.minihaies.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-barrier.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    
    if(item.name === 'Marker'){
      this.markers.push(
        {
          name:'marker'+(this.markers.length+1), 
          number:this.markers.length+1,
          src:'../../../assets/icons/exercices/interface/Equipement-marker.svg',
          active:false,
          topactif:false,
          bottomactif:false,
          leftactif:false,
          rightactif:false,
          classColor:''
        }
      )
    }
    this.equipHidden = false;
  }

  addAccessories(){
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
