import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {IUser} from '../model/i-user';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'tfs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user$: Observable<IUser>;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user$ = this.authService.getUser$();
  }
  logoutClick() {
    this.authService.logout();
  }

}
