import { Injectable, Component, OnInit, Inject, ViewChild , OnChanges , HostListener, ElementRef  } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { StepsServiceService } from '../../../services/steps-service.service';
import 'leader-line';
import { uid } from 'uid';

declare const PlainDraggable: any;
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
  @ViewChild('fieldscontainer') fieldscontainer!: ElementRef;
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

  btnLinesStyle= [
    {style:'normal', linestyle : true, src:'../../../assets/icons/lines/line.png' },
    {style:'dash', linestyle : false, src:'../../../assets/icons/lines/line-cut.png'},
    {style:'curve', linestyle : false, src:'../../../assets/icons/lines/line-round.png'}
  ];

  btnListStartActor = [
    {btn:'color', src:'../../assets/icons/exercices/interface/Icon-button-white.svg', active:'false'},
    {btn:'flag', src:'../../assets/icons/exercices/interface/flag-start.svg', active:'false'},
    {btn:'bucket', src:'../../assets/icons/exercices/interface/bucket.svg', active:'false'}
  ];

  btnDuplicateEquipment = [
    {btn:'duplicate', src:'../../assets/icons/exercices/interface/duplicate.svg', active:'false'},
    {btn:'merge', src:'../../assets/icons/exercices/interface/merge.svg', active:'false'},
    {btn:'bucket', src:'../../assets/icons/exercices/interface/bucket.svg', active:'false'}
  ];

  btnColorEquipment = [
    {btn:'white', src:'../../assets/icons/exercices/interface/Icon-button-white.svg', active:'false'},
    {btn:'green', src:'../../assets/icons/exercices/interface/Icon-button-green.svg', active:'false'},
    {btn:'red', src:'../../assets/icons/exercices/interface/Icon-button-red.svg', active:'false'},
    {btn:'yellow', src:'../../assets/icons/exercices/interface/Icon-button-yellow.svg', active:'false'},
    {btn:'blue', src:'../../assets/icons/exercices/interface/Icon-button-blue.svg', active:'false'}

  ];


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

  logkey(e:any){
    console.log('CLIENT X AND Y : ',e.clientX, e.clientY)
  }


  displayColor = false;
  displayColors(stateColor:any){
    if(stateColor.btn === 'color'){
      this.displayColor = true;
      console.log('IS COLOR SELECTED : !',stateColor.btn, 'actor', this.actorSelect)
    }
  }

  chooseColors(color:any){
    console.log('COULEUR CHOISI : ! ',color.btn);
    this.displayColor = false;
  }

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
        action:[],
        stepTotal:''
      }
    )
    console.log('LES ECONES : ! ! ',this.econes)
  }

  addAction(econeSelect:any){
    console.log('ADD ACTION! : ', econeSelect)
    console.log(econeSelect.action)
    econeSelect.action.push({

    });
    if(econeSelect.action.length !== 0){
      econeSelect.action.forEach((action:any) =>{
        console.log('ACTION OF ECONES : ! ',action)
      });
    }
  }
  
  // CANVAS DISPLAY 
  lastSelection:any;
  line:any = [];
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

  container!:any;
  boundingBoxVectorStarts:any[]=[];
  drawLines(){
    console.log('LES LINES : ! ',this.lines)
    let liner :any[]= [];
    // this.eraseLines()
    // this.container = document.getElementsByClassName("fields-container");

    if(this.lines.length !== 0){
       setTimeout(() => {
      this.lines.forEach(line => {
      
          let container = document.querySelector<HTMLElement>(".fields-container");
          let containerAll = document.querySelectorAll(".fields-container");

      

          const startingElement = document.querySelector('#'+line.select[0].name);
          const startingelementAll = document.querySelector<HTMLElement>('#'+line.select[0].name);
          const endingElement = document.querySelector('#'+line.select[1].name);
            liner.push(new LeaderLine(startingElement, endingElement));

            
            liner[liner.length-1].size = 2;
            liner[liner.length-1].color = 'grey';
            liner[liner.length-1].path = 'fluid';
            liner[liner.length-1].setOptions({
              startPlug: 'disc',
              endPlug: 'arrow3'
            });
            if(startingElement !== null){
             if(container !== null){
                console.log(container, containerAll)
                console.log('START BOUND !!', startingElement.getBoundingClientRect(),startingElement, startingelementAll)
              
                let div = document.createElement("div");
                // this.boundingBoxVectorStarts.push()
                // div.classList.add("container-drag");
                // div.style.background="black"
                // div.innerHTML = '<div style="position: abslute;width: 6px; height: 6px;color: white;background: black;top:'+Math.round(startingElement.getBoundingClientRect().top)+'px;left: 200px;"></div>';
                // containerAll[0].append(div)
              
                // containerAll[0].innerHTML = '<div style="position: absolute;width: 46px; height: 100px;color: white;background: black;top: 113px;left: 332px;"><p style="top: 37px;position: absolute;">Principle elements</p><span class="accesories"  ></span></div>';
                // console.log(div.childNodes, div, containerAll);
    
              }
              
              startingElement.addEventListener('click', () => { this.selectLine(liner[liner.length-1]); });
              startingElement.addEventListener('mousemove', () => { this.fixLine(liner[liner.length-1]); });
              startingElement.addEventListener('ondrag', () => { this.fixLine(liner[liner.length-1]); });
              startingElement.addEventListener('touchmove', () => { this.fixLine(liner[liner.length-1]); });
             
             
            }
            if(endingElement !== null){
              // console.log('END BOUND',endingElement.getBoundingClientRect() )
              endingElement.addEventListener('mousemove', () => { this.fixLine(liner[liner.length-1]); });
              endingElement.addEventListener('touchmove', () => { this.fixLine(liner[liner.length-1]); });
            }
       })
     }, 100);
    }
  }

  fixLine(line:any) {
    line.position();
  }
  

  // eraseLines(){
  //   const boxes = document.querySelectorAll('.leader-line');
  //   // this.fieldscontainer.nativeElement.appendChild()
  //   console.log('SELECTOR , ',this.fieldscontainer.nativeElement,  boxes)
  //   boxes.forEach((boxe:any,index:number) =>{
  //     boxe.remove();

  //   });
  // }

  changeFormatLineAtStart(item:any){
    console.log('Le style choisi: ',item)
    this.btnLinesStyle.forEach(line =>{
      if(item.style === line.style){
        line.linestyle = true;
      }else{
        line.linestyle = false;
      }
      if(item.style === 'dash'){
        this.selectedItem.dash = true; 
      }
      if(item.style === 'normal'){
        this.selectedItem.path = 'straight';
        this.selectedItem.dash = false; 
      }
      if(item.style === 'curve'){
        this.selectedItem.path = 'magnet';
        this.selectedItem.dash = false; 
      }
    });
  

  }
  

  // chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.unecatef.fr/uploads/Animation%20de%20syst%C3%A8me137.pdf
  selectedItem:any;
  selectLine(item:any) {
    this.selectedItem = item; 
    console.log('ON CHOISI CETTE LIGNE : ! ',item)

    // item.dash = true;

    // if (unselect) {
    //   item.line.setOptions({outline: false, endPlugOutline: false});
    //   item.isSelected = false;
    //   selectedItem = null;
    // } else if (item.line) {
    //   if (selectedItem) { select(selectedItem, true); }
    //   item.line.setOptions({
    //     outline: true,
    //     outlineColor: '#2ca4fa',
    //     endPlugOutline: true
    //   });
    //   item.isSelected = true;
    //   selectedItem = item;
    // }
  }


  ifEconeSelect = false;
  ifActorSelect = false;
  econeSelect :any = null;
  actorSelect:any = null;
  // Display this Actif ? 
  passing = false;
  
  displayChangeStart:any=[{x:0,y:0}]

  displayUtils(artefact:any){
    console.log('LE NOM DE L\'ARTEFACT',artefact.name);
    let Element = document.querySelector<HTMLElement>("."+artefact.name);
    const ElementSelectBound = document.querySelector('#'+artefact.name);
    if(ElementSelectBound !== null){
      console.log('START BOUND !!', Math.round(ElementSelectBound.getBoundingClientRect().x-30),Math.round(ElementSelectBound.getBoundingClientRect().y-30))
      this.displayChangeStart[0].x = Math.round(ElementSelectBound.getBoundingClientRect().x-30);
      this.displayChangeStart[0].y = Math.round(ElementSelectBound.getBoundingClientRect().y-50);
    }
    let ElementAll = document.querySelectorAll("."+artefact.name);
    if(Element !== null){
      console.log(Element, Element.offsetLeft, ElementAll)
    }

    if(artefact.active == true){
      this.passing=true;
      console.log('on est à true')
      this.econeSelect = null;
      this.ifEconeSelect = false;
      artefact.active = false;
      artefact.topactif = false;
      artefact.bottomactif = false;
      artefact.leftactif = false;
      artefact.rightactif = false;
      this.ifActorSelect = false;
    }else{
      if(artefact.active == false && this.passing == false){
        console.log('on active')
        this.passing=true;
        artefact.active = true;
        this.econeSelect = artefact;
      }

      if(artefact.name.includes("Econe") == true ){
        this.ifEconeSelect = true;
        this.ifActorSelect = false;
        this.econeSelect = artefact;

       
      }
      if(artefact.name.includes("Actor") == true ){
        this.ifActorSelect = true;
        this.ifEconeSelect = false;
        this.actorSelect = artefact;
      }


      
    }
    
    this.passing=false;
  }


  selector:any=[]
  last = false;
  selectTopDrawer(artefact:any){
    this.last = false;
    console.log('select top drawer', artefact,  this.selector)
    let topPointSelect = document.querySelector<HTMLElement>(".top"+artefact.name);
    let selector = document.querySelector("#"+artefact.name);
    if(topPointSelect !== null){
      console.log(artefact.name, this.selector)
      if(this.selector.length === 1){
          this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
          this.lines.push({select:this.selector})
          console.log('le selecteur', this.selector,'les lines', this.lines)
          this.selector = [];
          // this.eraseLines();
          this.drawLines();
          this.last=true;
      }
      if(this.selector.length === 0 && this.last === false){

        this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
      }
      console.log(artefact.name, this.selector)
    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
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
    this.last = false;
    console.log('select top drawer 1', artefact)
    let bottomPointSelect = document.querySelector<HTMLElement>(".bottom"+artefact.name);
    let selector = document.querySelector("#"+artefact.name);
    if(bottomPointSelect !== null){
      console.log(artefact.name, this.selector)
      if(this.selector.length === 1){
          this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
          this.lines.push({select:this.selector})
          console.log('le selecteur', this.selector,'les lines', this.lines)
          this.selector = [];
          this.last=true;
          // this.eraseLines();
          this.drawLines();
      }
      if(this.selector.length === 0 && this.last === false){

        this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
      }
      console.log(artefact.name, this.selector)
    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
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
    this.last = false;
    console.log('select top drawer', artefact)
    let rightPointSelect = document.querySelector<HTMLElement>(".right"+artefact.name);
    let selector = document.querySelector("#"+artefact.name);
    if(rightPointSelect !== null){
      console.log(artefact.name, this.selector)
      if(this.selector.length === 1){
          this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
          this.lines.push({select:this.selector})
          console.log('le selecteur', this.selector,'les lines', this.lines)
          this.selector = [];
          this.last=true;
          // this.eraseLines();
          this.drawLines();
      }
      if(this.selector.length === 0 && this.last === false){

        this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
      }
      console.log(artefact.name, this.selector)
    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
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
    this.last = false;
    console.log('select top drawer', artefact)
    let leftPointSelect = document.querySelector<HTMLElement>(".left"+artefact.name);
    let selector = document.querySelector("#"+artefact.name);
    if(leftPointSelect !== null){
      console.log(artefact.name, this.selector)
      if(this.selector.length === 1){
          this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
          this.lines.push({select:this.selector})
          console.log('le selecteur', this.selector,'les lines', this.lines)
          this.selector = [];
          this.last=true;
          // this.eraseLines();
          this.drawLines();
      }
      if(this.selector.length === 0 && this.last === false){

        this.selector.push({name:artefact.name,selector: selector,artefact:artefact})
      }
      console.log(artefact.name, this.selector)
    }
    console.log('le selecteur', this.selector,'les lines', this.lines)
    
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


  pinchIn(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
      console.log(event.deltaY)            
      if(zoomElement !== null){ 
          zoomElement.style.transform = `scale(${this.zoom += 0.1})`;
          this.scale = `scale(${Math.round(this.zoom += 0.1)})`;
          // console.log('ZOOM IN', this.zoom - 0.1);
    }
  }

  pinchOut(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
        console.log(event.deltaY)            
        if(zoomElement !== null){ 
         if(this.zoom - this.ZOOM_SPEED >= 6){
            zoomElement.style.transform = `scale(${this.zoom -= 0.1})`;
            this.scale = `scale(${Math.round(this.zoom -= 0.1)})`;
            // console.log('ZOOM OUT', this.zoom - 0.1);
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
      // console.log('we swipe Right:', event, event.distance, zoomElement.style, zoomElementAll)
      // console.log(zoomElement.style.transform, newtranslate, this.scale)
      zoomElement.style.transform = this.scale + newtranslate;
    }
  }


  swipeEventLeft(event:any){
    let zoomElement = document.querySelector<HTMLElement>(".fields-container");
    this.xgo = this.xgo - 3;
    this.ygo = this.ygo;
    let newtranslate = "translate3d("+Math.round(this.xgo)+"px,"+Math.round(this.ygo)+"px,0px)";
    if(zoomElement !== null){
      // console.log('we swipe left:', event, event.distance, zoomElement)
      // console.log(zoomElement.style.transform, newtranslate, this.scale)
      zoomElement.style.transform = this.scale + newtranslate;
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
        name:'Actor'+(Number(this.actors.length)+1), 
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
    // console.log('PLACE',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    if(zoomElement !== null){
      // console.log(zoomElement.style.transform)
      // zoomElement.style.transform = 'scale(0.08) translate3d(0px, 0px, 0px)';
    }
  }

  getStartMoove(event:any,econe:any){
    // console.log('START',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    // this.eraseLines()
    if(zoomElement !== null){
      // zoomElement.style.transform = 'scale(0.08) translate3d('+event.distance.x+'px,'+event.distance.y+'px, 0px)';
    }
  }

  getEndMoove(event:any,econe:any){
    // console.log('END',event,econe)
    let zoomElement = document.querySelector<HTMLElement>("."+econe.name);
    // this.drawLines()
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
