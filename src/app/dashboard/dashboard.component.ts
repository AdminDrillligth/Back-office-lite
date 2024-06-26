import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministrationComponent } from '../administration/administration.component';
import { UtilsService } from '../../services/utils.service';
import { UserHandlersServiceAdmin } from '../../services/user-handlers-admin.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})


export class DashboardComponent implements OnInit{
  widthcard:number=700;
  heigthCard:number=300;
  widthcardEx:number= 700;
  heigthCardEx:number=300;
  usersData :any[] = [];
  DataUsers:any[] = [];
  theme : any = "";
  user:any;
  AccountOfUser:any=[];
  asAdmin = false;
  userSource:any = undefined;
  constructor(
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private utilsService: UtilsService,
    private administrationComponent:AdministrationComponent,
    private router: Router ){}

  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
     console.log('THEME !: ',theme)
    });


    setTimeout(() => {
      let card = document.getElementById('cardChart');
      this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
      console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
      console.log('INFO : CARD  :! : ', card);
      if(card !== null){
        // console.log(card.offsetWidth)
          this.widthcard=Math.round(card.offsetWidth-90);
          this.heigthCard=Math.round(card.offsetHeight-90);
          console.log(this.userSource)
          if(this.AccountOfUser.staff.length > 0 ||this.AccountOfUser.users.length > 0){
            this.usersData = [
              { name: "Staff", value:this.AccountOfUser.staff.length},
              { name: "Participants", value:this.AccountOfUser.users.length}
            ]
          }
          
      }
      let cardEx = document.getElementById('exercicesCharts');
      if(cardEx !== null){
        // console.log(card.offsetWidth)
          this.widthcardEx=Math.round(cardEx.offsetWidth-90);
          this.heigthCardEx=Math.round(cardEx.offsetHeight-90);
          console.log(this.userSource)
         
          this.DataUsers = [
            {
              "name": "12-03-2024",
              "value": 112
            },
            {
              "name": "13-03-2024",
              "value": 170
            },
            {
              "name": "14-03-2024",
              "value": 108
            },
            {
              "name": "15-03-2024",
              "value": 203
            },
            {
              "name": "16-03-2024",
              "value": 133
            },
            {
              "name": "17-03-2024",
              "value": 20
            },
            {
              "name": "18-03-2024",
              "value": 53
            }
          ]
      }

    }, 1200);

   
    this.utilsService._seeAsAdmin.subscribe((asAdmin:any) => {
      if(asAdmin !== null){
        if(asAdmin === true){
          this.asAdmin = true;
          console.log('on est en visu admin : ! ')
          let userDetailAccount = JSON.parse(localStorage.getItem('account-data-user') || '{}');
          console.log('LE DETAIL DU USER : ! ',userDetailAccount)
          console.log('LE DETAIL DU USER : ! EXERCICES:! : ', userDetailAccount.trainings);
          this.userSource = userDetailAccount;
          let card = document.getElementById('cardChart');
          if(card !== null){
            // console.log(card.offsetWidth)
            this.widthcard=Math.round(card.offsetWidth-90);
            this.heigthCard=Math.round(card.offsetHeight-90);
            if(this.userSource.staff.length > 0 || this.userSource.users.length > 0){
              this.usersData = [
                { name: "Staff", value:this.userSource.staff.length},
                { name: "Participants", value:this.userSource.users.length}
              ]
            }
           
          }

        }
        if(asAdmin === false){
          console.log('on est en visu non admin : ! ')

        let card = document.getElementById('cardChart');
    
        this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
        if(card !== null){
          // console.log(card.offsetWidth)
            this.widthcard=Math.round(card.offsetWidth-90);
            this.heigthCard=Math.round(card.offsetHeight-90);
            this.usersData = [
              { name: "Staff", value:this.AccountOfUser.staff.length},
              { name: "Participants", value:this.AccountOfUser.users.length}
            ]
          }
        }
      }
    })

  }

  addVideo(){
    this.router.navigate(['videos']);
  }

  createClient(){
    this.router.navigate(['administration']);
    // setTimeout(() => {
    //   this.administrationComponent.createCustomer();
    // }, 1000);

  }
}
