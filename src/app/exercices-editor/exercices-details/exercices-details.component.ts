import { Injectable, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-exercices-details',
  templateUrl: './exercices-details.component.html',
  styleUrls: ['./exercices-details.component.scss']
})
export class ExercicesDetailsComponent {


  constructor(
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


}
