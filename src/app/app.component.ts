import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, Output, HostBinding} from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { UserHandlersServiceAdmin } from '../services/user-handlers-admin.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { UserHandlersServiceAdmin } from '../../services/user-handlers-admin.service';
// import { UserHandlersServiceCustomer } from '../../services/user-handlers-customer.service';
// Multiple  Theme service
// https://stackblitz.com/edit/angular-material-theme-switch-with-static-json?file=src%2Fapp%2Fstyle-manager.service.ts

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  @HostBinding('class') className = '';
  title = 'drilllight';
  profile:any=[];
  showFiller = true;
  seeNavigation = true;
  toggleControl = new FormControl(false);
  // Start of SideBArItems !
  sideBarItems:any[]= [
    {
      id: 1,
      name: 'Tableau de bord',
      icone: 'assets/icons/menu_dashboard.svg',
      link: 'dashboard',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 2,
      name: 'Entraînements',
      icone: 'assets/icons/menu_trainings.svg',
      link: 'trainings',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 3,
      name: 'Administration',
      icone: 'assets/icons/menu_sports.svg',
      link: 'administration',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 4,
      name: 'E-cônes',
      icone: 'assets/icons/menu_econe.svg',
      link: 'econes',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 5,
      name: 'Vidéos',
      icone: 'assets/icons/menu_videos.svg',
      link: 'videos',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 6,
      name: 'Paramètres',
      icone: 'assets/icons/menu_settings.svg',
      link: 'parameters',
      activeClass: 'active_btn',
      activatedRight:[]
    },
  ];
  seeAsAdmin:boolean=false;
  AccountOfUser:any;
  user:any = [];
  AllAccount:any[] = [];
  seeAsAccount:any;
  // 0 FULL, 1 AUTORITE, 2 UNDER AUTORITE, 3 USER
  constructor(
    private url:LocationStrategy,
    // private overlay: OverlayContainer,
    private afAuth:AngularFireAuth,
    private userHandlersServiceAdmin:UserHandlersServiceAdmin,
    public utilsService: UtilsService,
    private router:Router
  ){

  }

  ngOnInit(): void {
        //*
        this.toggleControl.valueChanges.subscribe((darkMode) => {
          const darkClassName = 'darkMode';
          this.className = darkMode ? darkClassName : '';
          this.utilsService.changeThemeTemplate(this.className);
        });
        this.utilsService._seeCustumorProfilOptions.subscribe((account:any) => {
          // this.seeAsAccount = account;
          console.log('ACCOUNT : ! ',account);
          // if(account !== null){
          //   console.log('ACCOUNT !: ',account.seeAs, account.account.asAdmin)
          //   if(account.seeAs === true){
          //     this.seeAsAdmin = true;
          //   }else{
          //     this.seeAsAdmin = false;
          //   }
          // }
        });
        this.utilsService._seeNavigation.subscribe((howToSeeNavigation:any) =>{
          // console.log('the nav is ',howToSeeNavigation)
          // this.seeNavigation = howToSeeNavigation;
        })

        if (this.router.url.includes('/login') || this.router.url === '/'){  
          this.seeNavigation = false;
        }else{
          this.seeNavigation = true;
          console.log(this.router.url)
        }
        this.updateData();
  }

  comeBackToAdmin(){
    this.utilsService.sendOfCustomerProfilOptions({account:this.seeAsAccount.account, seeAs : false});
    this.router.navigate(['administration']);
  }

  navigateTo(item:any){
    console.log('NAV TO ::: ',item);
    this.utilsService.changeThemeTemplate(this.className);
    this.router.navigate([item.link]);
  }

  logOut(){
    this.afAuth.signOut();
    this.router.navigate(['login']);
  }

  updateData(){
    
    if (this.router.url.includes('/login') || this.url.path() === '/'){  
      console.log(this.router, this.url.path())
      this.seeNavigation = false;
    }else{
      this.seeNavigation = true;
      console.log(this.router.url,this.url.path())
    }
        this.AccountOfUser = '';
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log(this.user)
        this.userHandlersServiceAdmin.getAccountWithEmail(this.user.email).subscribe((dataAccount:any) =>{
        //localStorage.setItem('account', JSON.stringify(dataAccount.docs[0].data()));
        this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
        // if(this.AccountOfUser.privileges.role === "Administrateur"){
        //   this.userHandlersServiceAdmin.getAccountAdmin().subscribe((allAccount:any) => {
        //     allAccount.docs.forEach((account:any) => {
        //       this.AllAccount.push({account:account.data(), id:account.id})
        //     })
        //     localStorage.setItem('allaccount', JSON.stringify(this.AllAccount));
        //   })
        // }
      });
  }
}

// export class RightsOfUsers {
//   constructor(
//     public appComponent:AppComponent
//   ){

//   }

//   title = 'Droits d\'utilisateurs';
//   profile:any=[];
//   rightsOfUser = []
//   // 0 FULL, 1 AUTORITE, 2 UNDER AUTORITE, 3 USER

//   accordTheRightsOfUsers(){

//   }

//   restrictionsOfUsers(){

//   }
// }

// export class ThemeOfUsersControl {
//   constructor(
//     public appComponent:AppComponent
//   ){

//   }


//   accordTheRightsOfUsers(){

//   }

//   restrictionsOfUsers(){

//   }
// }
