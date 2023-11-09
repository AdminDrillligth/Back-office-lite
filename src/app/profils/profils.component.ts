import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.scss']
})
export class ProfilsComponent implements OnInit{
  urlImg:any;
  eventImageFile:any;
  uploadedImages:any;
  selectedFile!: File;

  constructor(
    private utilsService: UtilsService
  ){}

  ngOnInit(): void {
    this.utilsService._dataOfUserAccounts.subscribe((accountDetail:any) => {
      console.log('Account Of User :  !: ',accountDetail);
    });
  }

  onFileChanged(event:any) {
    this.eventImageFile = [];
    this.eventImageFile = event;
    this.selectedFile = event.target.files[0];
    console.log('SELECTED FILE :: ',this.selectedFile)
  }

  onUpload() {
    this.urlImg = [];
    // upload code goes here
    console.log('SELECTED FILE :: ',this.selectedFile)
    let reader = new FileReader();
    if(this.selectedFile !==  undefined) {
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.urlImg = reader.result;
        console.log(this.urlImg)
      };
    }
  }

}
