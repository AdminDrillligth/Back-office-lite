import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showFiller = true;
  // 0 FULL, 1 AUTORITE, 2 UNDER AUTORITE, 3 USER

  sideBarItems:any[]= [
    {
      id: 1,
      name: 'Tableau de bord',
      icone: 'assets/icons/menu_dashboard.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
      activatedRight:[]
    },
    {
      id: 2,
      name: 'Entraînements',
      icone: 'assets/icons/menu_trainings.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
    },
    {
      id: 3,
      name: 'Administration',
      icone: 'assets/icons/menu_sports.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
    },
    {
      id: 4,
      name: 'E-cônes',
      icone: 'assets/icons/menu_econe.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
    },
    {
      id: 5,
      name: 'Vidéos',
      icone: 'assets/icons/menu_videos.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
    },
    {
      id: 6,
      name: 'Paramètres',
      icone: 'assets/icons/menu_settings.svg',
      link: '/admin/dashboard',
      activeClass: 'active_btn',
    },
  ];
}
