import { Injectable, NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { MatDividerModule} from '@angular/material/divider';
import { MainComponent } from './main/main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AdministrationComponent } from './administration/administration.component';
import { FinderComponent } from './finder/finder.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { ParametersComponent } from './parameters/parameters.component';
import { LogsComponent } from './logs/logs.component';
import { VideosComponent } from './videos/videos.component';
import { EconesComponent } from './econes/econes.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSelectModule} from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule , } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule  } from '@angular/common/http';
import { VideoEditoComponent } from './video-edito/video-edito.component';
import { ThemesComponent } from './themes/themes.component';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterPipe } from '../services/pipe/filter.pipe';
import { HighlightDirective } from '../services/directives/highlight.directive';
import { ProfilsComponent } from './profils/profils.component';
import * as Hammer from 'hammerjs';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatToolbarModule } from '@angular/material/toolbar';
import { QRCodeModule } from 'angularx-qrcode';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HistoryComponent } from './history/history.component';
import { HistoryDetailsComponent } from './history/history-details/history-details.component';
import { SubscribeComponent } from './administration/subscribe/subscribe.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExercicesEditorComponent } from './exercices-editor/exercices-editor.component';
import { SubscribesComponent } from './subscribes/subscribes.component';
import { ExercicesDetailsComponent } from './exercices-editor/exercices-details/exercices-details.component';
import { ExercicesSportSelectComponent } from './exercices-editor/exercices-sport-select/exercices-sport-select.component';
import { ExercicesThematicsComponent } from './exercices-editor/exercices-thematics/exercices-thematics.component';
import { ExercicesCategoriesComponent } from './exercices-editor/exercices-categories/exercices-categories.component';
import { ExercicesDrawerComponent } from './exercices-editor/exercices-drawer/exercices-drawer.component';
import { MatBadgeModule } from '@angular/material/badge';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Injectable()
export class HammerConfig extends HammerGestureConfig {
  override overrides = <any> {
      // I will only use the swap gesture so
      // I will deactivate the others to avoid overlaps
      pinch: { enable: true },'rotate': { enable: true },
      swipe: {enable: true, direction: Hammer.DIRECTION_ALL },
  }
}



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DashboardComponent,
    AdministrationComponent,
    FinderComponent,
    TrainingsComponent,
    ParametersComponent,
    LogsComponent,
    VideosComponent,
    EconesComponent,
    VideoEditoComponent,
    ThemesComponent,
    FilterPipe,
    HighlightDirective,
    ProfilsComponent,
    HistoryComponent,
    HistoryDetailsComponent,
    SubscribeComponent,
    ExercicesEditorComponent,
    SubscribesComponent,
    ExercicesDetailsComponent,
    ExercicesSportSelectComponent,
    ExercicesThematicsComponent,
    ExercicesCategoriesComponent,
    ExercicesDrawerComponent

  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    _MatSlideToggleRequiredValidatorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatSidenavModule,
    NgxChartsModule,
    MatDatepickerModule,
    DragDropModule,
    MatNativeDateModule,
    MatSliderModule,
    MatDialogModule,
    OverlayModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HammerModule,
    QRCodeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    AdministrationComponent,
    VideosComponent,
    DatePipe,
    MatDialog,
    MatDatepickerModule,
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
