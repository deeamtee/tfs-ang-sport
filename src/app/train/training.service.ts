import { Injectable } from '@angular/core';
import {IPurchase} from '../model/i-purchase';
import {AngularFireDatabase} from '@angular/fire/database';
import {combineLatest, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  static calcTotal(purchases: IPurchase[]): number {
    return purchases.reduce((total, purchase) => total + purchase.price, 0);
  }

  constructor(private db: AngularFireDatabase) {
  }

  loadPurchases(walletId: string): Observable<IPurchase[]> {
    return this.db.list(`purchasesPerWallets/${walletId}`)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots.map(({key}) => key)),
        map(purchaseIds => purchaseIds.map(purchaseId => this.getPurchaseStreamById(purchaseId))),
        switchMap(purchaseStreams => purchaseStreams.length !== 0 ? combineLatest(purchaseStreams) : of([])),
      );
  }

  addPurchase(purchase: IPurchase, walletId: string): Observable<any> {
    return of(this.db.list('purchases').push(purchase))
      .pipe(
        map(({key}) => ({[key]: true})),
        switchMap(dataToUpdate => this.db.object(`purchasesPerWallets/${walletId}`).update(dataToUpdate))
      );
  }

  deletePurchase(purchaseId: string, walletId: string) {
    of(this.db.object(`purchasesPerWallets/${walletId}/${purchaseId}`).remove())
      .pipe(
        switchMap(() => this.db.object(`purchases/${purchaseId}`).remove())
      )
      .subscribe();
  }

  private getPurchaseStreamById(purchaseId: string): Observable<IPurchase> {
    return this.db.object<IPurchase>(`purchases/${purchaseId}`)
      .snapshotChanges()
      .pipe(
        map(({key, payload}) => ({id: key, ...payload.val()}))
      );
  }
}
