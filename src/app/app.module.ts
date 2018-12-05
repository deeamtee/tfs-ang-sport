import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {appRoutes} from './app.routing';
import {RouterModule} from '@angular/router';
import { TrainComponent } from './train/train.component';
import { LoginComponent } from './login/login.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LoginModule} from './login/login.module';
import {ReactiveFormsModule} from '@angular/forms';
import { UserPipe } from './pipe/user.pipe';
import { TrainListComponent } from './train-list/train-list.component';
import { AddTrainComponent } from './add-train/add-train.component';
import {TrainModule} from './train/train.module';
import {TrainListModule} from './train-list/train-list.module';
import {AddTrainModule} from './add-train/add-train.module';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ProfileComponent,
    HomeComponent,
    NotFoundComponent,
    UserPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LoginModule,
    TrainListModule,
    AddTrainModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
