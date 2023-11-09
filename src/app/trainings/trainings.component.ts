import {  Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trainingService } from '../../services/firebase/get-training-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})



export class TrainingsComponent implements OnInit {
  searchText = '';
  categorie = new FormControl('');
  level = new FormControl('');
  theme = new FormControl('');
  categorieslist = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'SENIOR'];
  itemsNav = [
    {type:'Exercices', value:'Exercices', selected:true},
    {type:'Séances', value:'Séances', selected:false},
    {type:'Programmes', value:'Programmes', selected:false},
  ];

  levelsArray = [{id:0, name:'Facile'},{id:1, name:'Intermediaire'} ,{id:2, name:'Difficile'} ];
  
  thematics = [{ name: 'Tactique',id:0}, { name: 'Technique',id:1 }, { name: 'Physique', id:2 }, { name: 'Échauffement', id:3 },{ name: 'Finition', id:4 },
    { name: 'Prise d\'information', id:5 }, { name: 'Passe', id:6 }, { name: 'Frappe', id:7 }, { name: 'Dribble', id:8 }, { name: 'Jongle', id:9 },
    { name: 'Conduite de balle', id:10 }, { name: 'Endurance', id:11}, { name: 'Spécifique attaquant', id:12 }, { name: 'Spécifique défenseur', id:13 },
    { name: 'Spécifique milieu', id:14 }, { name: 'Spécifique gardien', id:15 }, { name: 'Autres', id:16 }];
  
  sports = [{ name: 'Foot', id:0}, { name: 'Rugby',id:1 }, { name: 'Boxe', id:2 }];
  cognitifs = [{ name: 'Sensori moteur',id:0}, { name: 'Perceptivo moteur',id:1 }, { name: 'Motricité fondamentale', id:2 }, { name: 'Motricité spécifique', id:3 }];
 
  recentTrainings:any = { type: 'recent', cards: []};
  categoryOneTrainings:any = { type: 'Pré-formation', cards:[]};
  categoryTwoTrainings:any = { type: 'Formation', cards:[]};
  categoryTreeTrainings:any = { type: 'Seniors', cards: []};

  chooseType:string='Exercices';
  audience:string='public';
  
  constructor(
    private router:Router,
    private utilsService: UtilsService,
    private trainingservice:trainingService,
    public dialog: MatDialog
    ){}
  ngOnInit(): void {
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER TRAININGS :! : ', AccountOfUser);
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
     });
    this.getInfoGLobal();
  }

  getInfoGLobal(){
    this.trainingservice.getTrainings().then((e:any)=>{
      console.log('First log: ',e)
      this.trainingservice.getinject().then((inject:any)=>{
        console.log('First logs: ',inject)
        this.recentTrainings = inject[0];
        console.log(this.recentTrainings)
        this.categoryOneTrainings =inject[1];
        console.log('VIEW',this.categoryOneTrainings)
        this.categoryTwoTrainings =inject[2];
        this.categoryTreeTrainings =inject[3];
        // this.highlightedsExercices = inject[4];
      })
    });
  }


  applyFilter(event: Event) {
    console.log('LE SEARCH : ',event)
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSourceAccounts.filter = filterValue.trim().toLowerCase();
  }


  openDialog(item:any) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: {item: item},
      panelClass: 'bg-color',
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  select(itemer:any){
    this.chooseType = itemer.value;
    this.itemsNav.forEach((item:any)=>{
      if(item.type === itemer.type){ item.selected = true;
      }else{ item.selected = false;}
    })
  }

  createExercice(){
    this.router.navigate(['exercices-editor']);
  }

  subscribes(){
    this.router.navigate(['subscribes']);
  }
}



@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./trainings.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
})
export class DialogContentExampleDialog implements OnInit{
  audience:string='public';
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  ngOnInit(): void {
   console.log('LES DATAS MODALS ',this.data.item)
  }

  
  addVideoToExercice(data:any){
    console.log('Les datas de l\'exercices',data)
  }
}