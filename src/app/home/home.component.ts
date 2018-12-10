import {Component, Input, OnInit, Output} from '@angular/core';
import {IUser} from '../model/i-user';
import {NEVER, Observable, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {IInfo} from '../model/i-info';
import {TrainingService} from '../train/training.service';
import {InfoService} from '../settings/info.service';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ITrain} from '../model/ITrain';



@Component({
  selector: 'tfs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user$: Observable<IUser>;
  @Input() info: IInfo;
  @Input() name: IInfo;
  @Input() photoURL: IInfo;
  infos$: Observable<IInfo[]>;

  constructor(private authService: AuthService,
              private infoService: InfoService,
  ) {
  }


  ngOnInit() {
    this.user$ = this.authService.getUser$();
    this.infos$ = this.infoService.getInfo();
    this.infos$.subscribe(console.log);
  }



}
