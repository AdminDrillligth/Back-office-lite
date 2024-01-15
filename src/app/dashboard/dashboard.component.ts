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
  widthcard:number=0;
  heigthCard:number=0;
  saleData :any[] = [];
  DataUsers:any[] = [];
  theme : any = "";
  user:any;
  AccountOfUser:any=[];
  constructor(
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    private utilsService: UtilsService,
    private administrationComponent:AdministrationComponent,
    private router: Router ){}

  ngOnInit(): void {
    this.utilsService._templateOptions.subscribe((theme:any) => {
     console.log('THEME !: ',theme)
    });
    // this.utilsService._seeCustumorProfilOptions.subscribe((account:any) => {
    //   console.log('ACCOUNT !: ',account)
    //   // Set local storage of user data !
    //  });
    
    setTimeout(() => {
        let card = document.getElementById('cardChart');
        if(card !== null){
          // console.log(card.offsetWidth)
          this.widthcard=card.offsetWidth-80;
          this.heigthCard=card.offsetHeight-80;
          this.saleData = [
            { name: "Utilisateurs total", value: 56 },
            { name: "Administrateurs", value:3},
            { name: "Clients", value:3 },
            { name: "Staff Clients", value:3},
            { name: "Utilisateurs Clients", value:3},
            { name: "Exercices", value: 122 },
            { name: "Vidéos", value: 50 },
          ]
          this.DataUsers = [
            { name: "Entraineurs", value: 56 },
            { name: "Joueurs", value: 122 },
            { name: "Staff Technique", value: 50 },
          ]
        }
        this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
    }, 1000);
  }

  addVideo(){
    this.router.navigate(['videos']);
  }

  createClient(){
    this.router.navigate(['administration']);
    setTimeout(() => {
      this.administrationComponent.createCustomer();
    }, 1000);

  }
}
