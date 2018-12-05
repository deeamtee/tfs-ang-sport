import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../auth/auth.service';
import {Observable, of} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {ITrain} from '../model/i-train';
import {IWallet} from '../model/iwallet';

@Injectable({
  providedIn: 'root'
})
export class TrainListService {
  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
  }

  getWalletById(walletId: string): Observable<IWallet> {
    return this.getUserId()
      .pipe(
        switchMap(uid => this.db.object<IWallet>(`users/${uid}/wallets/${walletId}`).valueChanges()),
        map((wallet) => wallet ? {...wallet, id: walletId} : wallet)
      );
  }

  getWallets(): Observable<IWallet[]> {
    return this.authService.getUser$()
      .pipe(
        switchMap(user => user ? this.getWalletsByUserId(user.uid) : of([]))
      );
  }

  addWallet() {
    return this.getUserId()
      .pipe(
        take(1),
        map(uid => this.db.list(`users/${uid}/wallets`)),
        switchMap(list => list.push({
          name: 'Новая тренировка',
          amount: 10000
        }))
      );
  }

  updateWallet(wallet: IWallet): Observable<any> {
    return this.getUserId()
      .pipe(
        take(1),
        map((uid) => this.db.object(`users/${uid}/wallets/${wallet.id}`)),
        switchMap(object => object.update(wallet))
      );
  }

  private getWalletsByUserId(uid: string) {
    return this.db.list<IWallet>(`users/${uid}/wallets`)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots.map(({key, payload}) => ({id: key, ...payload.val()})))
      );
  }

  private getUserId(): Observable<string> {
    return this.authService.getUser$()
      .pipe(
        filter(user => !!user),
        map(({uid}) => uid)
      );
  }
}
