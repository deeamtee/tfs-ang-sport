import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SettingsComponent} from './settings/settings.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {TrainListComponent} from './train-list/train-list.component';
import {AuthGuard} from './auth/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent
  },
  {
    path: 'train',
    canActivate: [AuthGuard],
    component: TrainListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',

    component: NotFoundComponent
  }
];
