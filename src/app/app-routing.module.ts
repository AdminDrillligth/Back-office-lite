import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from './administration/administration.component';
import { FinderComponent } from './finder/finder.component';
import { HelpComponent } from './help/help.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { ParametersComponent } from './parameters/parameters.component';
import { LogsComponent } from './logs/logs.component';
import { ProfilsComponent } from './profils/profils.component';
import { VideosComponent } from './videos/videos.component';
import { EconesComponent } from './econes/econes.component';
import { VideoEditoComponent } from './video-edito/video-edito.component';
import { HistoryComponent } from './history/history.component';
import { HistoryDetailsComponent } from './history/history-details/history-details.component';
import { ExercicesEditorComponent } from './exercices-editor/exercices-editor.component';
import { ExercicesDetailsComponent } from './exercices-editor/exercices-details/exercices-details.component';
import { ExercicesSportSelectComponent } from './exercices-editor/exercices-sport-select/exercices-sport-select.component';
import { ExercicesThematicsComponent } from './exercices-editor/exercices-thematics/exercices-thematics.component';
import { ExercicesCategoriesComponent } from './exercices-editor/exercices-categories/exercices-categories.component';
import { ExercicesDrawerComponent } from './exercices-editor/exercices-drawer/exercices-drawer.component';
import { SubscribesComponent } from './subscribes/subscribes.component';
import { PasswordComponent } from './password/password.component';
import { ResetComponent } from './reset/reset.component';

import { InscriptionComponent } from './inscription/inscription.component';




const routes: Routes = [
  {path:'',
  component:LoginComponent
  },
  {path:'login',
  component:LoginComponent
  },
  {path:'main',
  component:MainComponent
  },
  {path:'dashboard',
  component:DashboardComponent
  },
  {path:'administration',
  component:AdministrationComponent
  },
  {path:'parameters',
  component:ParametersComponent
  },
  {path:'trainings',
  component:TrainingsComponent
  },
  {path:'logs',
  component:LogsComponent
  },
  { path: 'profil',
  component: ProfilsComponent
  },
  {path:'finder',
  component:FinderComponent
  },
  {path:'videos',
  component:VideosComponent
  },
  {path:'econes',
  component:EconesComponent
  },
  { path:'video-edito',
   component:VideoEditoComponent
  },
  { path:'password',
   component:PasswordComponent
  },
  { path:'reset',
   component:ResetComponent
  },
  { path:'help',
   component:HelpComponent
  },
  { path:'inscription',
  component:InscriptionComponent
  },
  { path:'exercices-editor',
    component:ExercicesEditorComponent,
    children: [
      {
        path: 'exercices-details', // child route path
        component: ExercicesDetailsComponent, // child route component that the router renders
      },
      {
        path: 'exercices-sport-select', // child route path
        component: ExercicesSportSelectComponent, // child route component that the router renders
      },
      {
        path: 'exercices-thematics', // child route path
        component: ExercicesThematicsComponent, // child route component that the router renders
      },
      {
        path: 'exercices-categories', // child route path
        component: ExercicesCategoriesComponent, // child route component that the router renders
      },
      {
        path: 'exercices-drawer', // child route path
        component: ExercicesDrawerComponent, // child route component that the router renders
      },

      
      
    ]
  },
  { path:'subscribes',
  component:SubscribesComponent
  },
  
  {path:'history',
  component:HistoryComponent,
  children: [
    {
      path: 'history-details', // child route path
      component: HistoryDetailsComponent, // child route component that the router renders
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
