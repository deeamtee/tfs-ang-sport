import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {appRoutes} from './app.routing';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LoginModule} from './login/login.module';
import { UserPipe } from './pipe/user.pipe';
import {TrainListModule} from './train-list/train-list.module';
import {AddTrainModule} from './add-train/add-train.module';
import {WelcomePipe} from './pipe/welcome.pipe';
import {SettingsModule} from './settings/settings.module';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    NotFoundComponent,
    UserPipe,
    WelcomePipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LoginModule,
    TrainListModule,
    AddTrainModule,
    SettingsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
