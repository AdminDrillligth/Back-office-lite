import { inject, Component, EventEmitter, Input, OnInit, Output, Inject, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FireStoreServiceVideos } from '../../services/firebase/firestoreservice-videos';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule, NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { map, startWith} from 'rxjs/operators';
import { MatIconModule} from '@angular/material/icon';
import { NgFor, AsyncPipe} from '@angular/common';
import { UserHandlersServiceAdmin } from 'src/services/user-handlers-admin.service';
import { UtilsService } from '../../services/utils.service';



@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})

export class VideosComponent {
  @Input()
  title!: string;
  @Input()
  text!: string;
  task!: AngularFireUploadTask;
  percentage!: Observable<number | undefined>;
  snapshot!: Observable<any>;
  downloadURL!: Observable<any>;
  uploadedVideo: any;
  uploadPercent!: Observable<any>;
  @Output() uploadImage: EventEmitter<any> = new EventEmitter<any>();
  recentVideos: any = { type: 'recents', cards: [ ] };
  user!:string;
  allVideos: any = { cards: [] };
  selectedTraineds:any;
  favorites: any = { cards: [] };
  traineds=[]
  imagesArray = [
    {url :'assets/images/fond-terrain-1.jpg'},
    {url : 'assets/images/Football.jpg'},
    {url : 'assets/images/images.jpg'},
    {url : 'assets/images/téléchargement (1).jpg'},
    {url : 'assets/images/téléchargement (2).jpg'},
    {url : 'assets/images/téléchargement (3).jpg' },
    {url : 'assets/images/téléchargement.jpg'},
    {url :'assets/images/fond-terrain-1.jpg'},
    {url : 'assets/images/Football.jpg'},
    {url : 'assets/images/images.jpg'},
    {url : 'assets/images/téléchargement (1).jpg'},
    {url : 'assets/images/téléchargement (2).jpg'},
    {url : 'assets/images/téléchargement (3).jpg' },
    {url : 'assets/images/téléchargement.jpg'},
   ]
  constructor(
    private utilsService: UtilsService,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private router: Router,
    public fireStoreServiceVideos:FireStoreServiceVideos
  ){}

  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
      console.log('THEME !: ',theme)
     });
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user)
    this.GetterVideoListing()

  }

  counterData = 0;

  getAccountWithEmail(){

  }

  GetterVideoListing(info?:any){
    this.allVideos.cards.length = 0;
    setTimeout(() => {
      this.fireStoreServiceVideos.getVideoOfUser().subscribe((docSnap: any) => {
        console.log('Le snap ::', docSnap)
        docSnap.forEach((e:any) => {
          let favorite;
          if(e.data().favorite !== undefined || e.data().favorite !== null){ favorite = e.data().favorite;}else{favorite = false;}
          console.log('chooose ::: ',e.id);
          console.log('chooose les datas de la videos ::: ::: ',e.data());
          this.allVideos.cards.push({ id_video: e.data().id_video,selectedTraineds: e.data().selectedTraineds, id: e.id, image: this.imagesArray[this.counterData].url,time: '15', text: e.data().name,
            days_left: 2, iconType: 'heart', createDate: e.data().date,usermail:e.data().usermail, favorite: favorite,etiquette:e.data().etiquette, title:e.data().title, comment:e.data().comment})
          if(this.allVideos.cards[this.allVideos.cards.length-1].favorite === true){
            this.favorites.cards.push(this.allVideos.cards[this.allVideos.cards.length-1])
          }
          this.counterData = this.counterData + 1;
          console.log('IMAGES :: ',this.imagesArray[this.counterData])
          })
        console.log('La videos ::: ::: ',this.allVideos.cards);
        this.userHandlersServiceAdmin.getAccountWithEmail(this.allVideos.cards[0].usermail).subscribe((e:any)=>{
          console.log('le retour du account', e.docs[0].data().traineds)
          this.traineds = e.docs[0].data().traineds;
        })
      });
    }, 300);
  }

  removeVideo() {
    this.uploadedVideo = {};
  }


  openDialog(item:any){
    const dialogRef = this.dialog.open(DialogUpdateVideo, {
      data:{item:item, traineds:this.traineds},
      panelClass: 'bg-color',
      width:'90%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetterVideoListing();
    });
  }

  navigateToEdit(item:any){
    console.log('LE ITEM DE LA VIDEO ! ',item)
    this.router.navigate(['video-edito']);
  }

  upload = 0;
  useVideo(event:any){
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // Read file as data url
      reader.onloadend = (e: any) => {
        this.uploadedVideo = { data: e.target['result'], propretys: event.target.files[0]};
        const file = event.target.files[0];
        // found PRIVATE OR NOT
        const filePath = '/upload/'+file.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        // observe percentage changes
        console.log(this.upload)
        this.upload = 1;
        this.uploadPercent = task.percentageChanges();
        var element = document.getElementById('UploadDiv');
        // get notified when the download URL is available
        task.snapshotChanges().pipe(
              finalize(() =>
              fileRef.getDownloadURL().subscribe(url => {
              this.upload = 0;
              this.fireStoreServiceVideos.addVideo(file.name, url)
              setTimeout(() => {
                this.upload = 0;
              }, 300);
            })
          )
          ).subscribe()
        console.log(this.downloadURL)
        var element = document.getElementById('UploadDiv');
        this.uploadImage.emit(this.uploadedVideo);
      };
    }
  }
}



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //condition true
    const isSubmitted = form && form.submitted;
    //false
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'dialog-update-video',
  templateUrl: 'dialog-update-video.html',
  styleUrls: ['./videos.component.scss'],
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

export class DialogUpdateVideo implements OnInit{
  rights: string[] = ['Videos', 'Edition Exercices','Bouquet Exercices','Exercices', 'Edition Vidéos', 'Logs', 'Dashboard', 'Administration', 'Entrainements'];
  roles: string[] = ['Club Gold', 'Club Siver', 'Club', 'Staff Gold', 'Staff Silver', 'Staff','Joueur Gold','Joueur Silver', 'Joeur'];
  title = new FormControl('');
  comment= new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  etiquette: string[] = ['video'];
  allTags: string[] = ['vitesse', 'étirement', 'échaufement', 'match', 'prise d\'informations'];
  selectedTraineds:any;
  traineds:any[]=[]
  @ViewChild('etiquetage') etiquetage!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  constructor(
     private fireStoreServiceVideos:FireStoreServiceVideos,
     public dialogRef: MatDialogRef<DialogUpdateVideo>,
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
        this.comment.setValue(this.data.item.comment);
        this.title.setValue(this.data.item.title);
        this.traineds = this.data.traineds
        // this.etiquette = this.data.item.etiquette;
        if(this.data.item.selectedTraineds !== null){
          this.selectedTraineds = this.data.item.selectedTraineds;
          console.log('this.selectedTraineds :: ',this.selectedTraineds)
        }
      }else{
        // this.etiquette = ['video'];
      }
    }
  }

  selectChange(event:any){
    console.log(event.value);
  }


  closeModal(){
    let data = {title:this.title.value,comment:this.comment.value, etiquette:this.etiquette,selectedTraineds:this.selectedTraineds }
    this.fireStoreServiceVideos.updateInfoVideoWithIdex(this.data.item.id_video,data)
     // if(this.update === false){
    //   // this.FireStoreServiceVideos.addAccountCustomer(data);
    // }else{
    //   // this.userHandlersServiceCustomer.updateAccountCustomer(this.data.id, data);
    //   this.update = false;
    // }
    setTimeout(() => {
      this.dialogRef.close(data);
    }, 500);

  }

  selectChangeRights(event:any){
    console.log(event.value);

  }

  selectChangeRole(event:any){
    console.log(event.value);
  }

  matcher = new MyErrorStateMatcher();
}

