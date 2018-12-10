import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {IInfo} from '../model/i-info';
import {Observable, of} from 'rxjs';
import {ITrain} from '../model/ITrain';


@Injectable({
  providedIn: 'root'
})
export class InfoService {
  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
  }

  addInfo(info: IInfo) {
    return this.getUserId()
      .pipe(
        map(uid => this.db.list(`users/${uid}/infos`)),
        switchMap(list => list.push(info))
      );
  }

   getUserId(): Observable<string> {
    return this.authService.getUser$()
      .pipe(
        filter(user => !!user),
        map(({uid}) => uid)
      );

  }

  getInfoById(infoId: string): Observable<IInfo> {
    return this.getUserId()
      .pipe(
        switchMap(uid => this.db.object<IInfo>(`users/${uid}/infos/${infoId}`).valueChanges()),
        map((info) => info ? {...info, id: infoId} : info)
      );
  }

  getInfo(): Observable<IInfo[]> {
    return this.authService.getUser$()
      .pipe(
        switchMap(user => user ? this.getInfosByUserId(user.uid) : of([])),
        map(info => info[0])
      );
  }

  getInfosByUserId(uid: string) {
    return this.db.list<IInfo>(`users/${uid}/infos`)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots.map(({key, payload}) => ({id: key, ...payload.val()})))
      );
  }

}
