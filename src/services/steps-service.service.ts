import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { uid } from 'uid';
import { Observable } from 'rxjs/internal/Observable';
import { FireStoreServiceImages } from '../services/firebase/firestoreservice-images';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class StepsServiceService {
  private exerciceStepService: BehaviorSubject<any>;
  private titleOfExercice: BehaviorSubject<any>;
  constructor(

  ) {
    this.exerciceStepService = new BehaviorSubject(null);
    this.titleOfExercice = new BehaviorSubject('');
   }


  get _stepNumberBase() {
    return this.exerciceStepService.asObservable();
  }

  addChangeNumberOfStep(numb: number) {
    console.log('Step Number: ',numb)
    this.exerciceStepService.next(numb);
  }

  substractChangeNumberOfStep(numb: number) {
    console.log('Step Number: ',numb)
    this.exerciceStepService.next(numb);
  }

  get _titleOfexercice() {
    return this.titleOfExercice.asObservable();
  }

  updateTitle(title:string){
    console.log('Title of Exercice: ',title)
    this.titleOfExercice.next(title)
  }
}
