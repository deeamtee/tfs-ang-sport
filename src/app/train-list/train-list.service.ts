import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../auth/auth.service';
import {Observable, of} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {ITrain} from '../model/ITrain';

@Injectable({
  providedIn: 'root'
})
export class TrainListService {
  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
  }

  getTrainById(trainId: string): Observable<ITrain> {
    return this.getUserId()
      .pipe(
        switchMap(uid => this.db.object<ITrain>(`users/${uid}/trains/${trainId}`).valueChanges()),
        map((train) => train ? {...train, id: trainId} : train)
      );
  }

  getTrains(): Observable<ITrain[]> {
    return this.authService.getUser$()
      .pipe(
        switchMap(user => user ? this.getTrainsByUserId(user.uid) : of([]))
      );
  }



  addTrain() {
    return this.getUserId()
      .pipe(
        take(1),
        map(uid => this.db.list(`users/${uid}/trains`)),
        switchMap(list => list.push({
          name: 'День'
        }))
      );
  }

  updateTrain(train: ITrain): Observable<any> {
    return this.getUserId()
      .pipe(
        take(1),
        map((uid) => this.db.object(`users/${uid}/trains/${train.id}`)),
        switchMap(object => object.update(train))
      );
  }

  private getTrainsByUserId(uid: string) {
    return this.db.list<ITrain>(`users/${uid}/trains`)
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
