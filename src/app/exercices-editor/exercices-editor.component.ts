import {  Component, OnInit, Inject } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-exercices-editor',
  templateUrl: './exercices-editor.component.html',
  styleUrls: ['./exercices-editor.component.scss']
})


export class ExercicesEditorComponent {
  constructor(
    private utilsService: UtilsService,
    private router: Router )
    {

    }
  headerTitle:string='';
  stepService:any[]=[];
  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
    });
    let AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
    console.log('ACCOUNT OF USER EXERCICES EDITO :! : ', AccountOfUser);
    this.router.navigate(['exercices-editor/exercices-details']);

  }

  goTOcreate(){
    
  }

  nextStep(){
    
  }
}
