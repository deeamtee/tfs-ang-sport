import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ITrain} from '../model/i-train';
import {TrainListService} from './train-list.service';
import {takeUntil} from 'rxjs/operators';
import {IWallet} from '../model/iwallet';

@Component({
  selector: 'tfs-train-list',
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.css']
})
export class TrainListComponent implements OnInit {
  wallets$: Observable<IWallet[]>;
  private destroy$ = new Subject<void>();

  constructor(private walletListService: TrainListService) { }

  ngOnInit() {
    this.wallets$ = this.walletListService.getWallets();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  addWallet() {
    this.walletListService.addWallet()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
