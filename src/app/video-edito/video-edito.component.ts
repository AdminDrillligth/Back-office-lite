import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FireStoreServiceVideos } from '../../services/firebase/firestoreservice-videos';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-video-edito',
  templateUrl: './video-edito.component.html',
  styleUrls: ['./video-edito.component.scss']
})
export class VideoEditoComponent implements OnInit{
  videoId: any;
  url: any;
  videoTrue = false;
  videoData:any;
  constructor(
    public dialog: MatDialog,
    private fireStoreServiceVideos:FireStoreServiceVideos
  ){

  }
  ngOnInit(): void {
    this.videoId = JSON.parse(localStorage.getItem('idvideo') || '{}');
      console.log('ID VIDEO:: ::', this.videoId);
      this.url = '';
      // this.startTimer();
      this.fireStoreServiceVideos.getVideoOfUserWithID(this.videoId).subscribe((e: any) => {
          console.log('DETAILS VIDEO INFO', e.docs[0].data());
          this.url = e.docs[0].data().url;
          console.log(this.url)
          this.videoTrue = true;
          console.log('DETAILS VIDEO INFO', e.id, e.data().name);
          console.log('DETAILS VIDEO INFO', e.id, e.data().date);
        });
  }

  playVideo(event: any) {
    if (event.type === 'play') {
      // console.log('on play la video tag player !! ', event)
      // this.utilService.setPalyingVideo(true) ;
      // this.boolPLay = true;
      // this.videoTimelineComponent.runVideo(true);
    }
    if (event.type === 'pause') {

      // console.log('on pause', event.type)
      // clearInterval(this.aNewWay);
      // this.utilService.setPalyingVideo(false) ;
      // this.boolPLay = true;
      // this.videoTimelineComponent.runVideo(true);
    }
    else {
      //  this.utilService.setPalyingVideo(false)
      //  this.boolPLay = false;
    };
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogAddTag, {
      data:this.videoData,
      panelClass: 'bg-color',
      width:'90%'
    });
    dialogRef.afterClosed().subscribe(result => {
     console.log('result', result)
    });
  }

  onTimeUpdate(event: any) {
    // this.updateTagOverlaysDsiplay(event);
    // this.updateTagDsiplay(event);
  // DISPLAY OVERLAYS
  // console.log('TIME UPDATE : ! ',event.target.currentTime)
  // this.utilService.setCurrentTimeVideo(event.target.currentTime);
  let counter = 0;
  // let parseLeft = this.leftAutoTag.split('p');
  // this.leftAdd = parseLeft[0]
  // this.newWAy = Number(this.leftAdd) + 1;
  // this.leftAutoTag = this.newWAy.toString()+ 'px';

  // this.aNewWay  = setInterval(() =>{
  //   counter ++;
  // }, 200);
  }


}



@Component({
  selector: 'dialog-add-tag',
  templateUrl: 'dialog-add-tag.html',
  styleUrls: ['./video-edito.component.scss'],
  standalone: true,
  imports: [ 
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatInputModule, CommonModule, MatDialogModule, FormsModule, MatButtonModule],
})

export class DialogAddTag implements OnInit{
  rights: string[] = ['Videos', 'Edition Exercices','Bouquet Exercices','Exercices', 'Edition Vidéos', 'Logs', 'Dashboard', 'Administration', 'Entrainements'];
  roles: string[] = ['Club Gold', 'Club Siver', 'Club', 'Staff Gold', 'Staff Silver', 'Staff','Joueur Gold','Joueur Silver', 'Joeur'];
  title = new FormControl('');
  comment= new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  etiquette: string[] = ['video'];
  allTags: string[] = ['vitesse', 'étirement', 'échaufement', 'match', 'prise d\'informations'];

  @ViewChild('etiquetage') etiquetage!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  constructor(
     private fireStoreServiceVideos:FireStoreServiceVideos,
     public dialogRef: MatDialogRef<DialogAddTag>,
     @Inject(MAT_DIALOG_DATA) public data:any,
  ) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tags: string | null) => (tags ? this._filter(tags) : this.allTags.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.etiquette.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.etiquette.indexOf(fruit);
    if (index >= 0) {
      this.etiquette.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.etiquette.push(event.option.viewValue);
    this.etiquetage.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tags => tags.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
   console.log('LES DATAS MODALS ',this.data)
   if(this.data !== null){
      if(this.data.data !== null){
        this.comment.setValue(this.data.comment);
        this.title.setValue(this.data.title);
        // this.etiquette = this.data.etiquette;
      }else{
        // this.etiquette = ['video'];
      }
    }
  }

  selectChange(event:any){
    console.log(event.value);
  }


  closeModal(){
    let data = {title:this.title.value,comment:this.comment.value, etiquette:this.etiquette}
    this.fireStoreServiceVideos.updateInfoVideoWithIdex(this.data.id_video,data)
     // if(this.update === false){
    //   // this.FireStoreServiceVideos.addAccountCustomer(data);
    // }else{
    //   // this.userHandlersServiceCustomer.updateAccountCustomer(this.data.id, data);
    //   this.update = false;
    // }
    this.dialogRef.close(data);
  }

  selectChangeRights(event:any){
    console.log(event.value);
   
  }

  selectChangeRole(event:any){
    console.log(event.value);
  }

  
}

