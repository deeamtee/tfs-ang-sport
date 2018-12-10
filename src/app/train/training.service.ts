import { Injectable } from '@angular/core';
import {ITraining} from '../model/i-training';
import {AngularFireDatabase} from '@angular/fire/database';
import {combineLatest, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  static calcTotal(trainings: ITraining[]): number {
    return trainings.reduce((total, training) => total + training.number, 0);
  }

  constructor(private db: AngularFireDatabase) {
  }

  loadTraining(trainId: string): Observable<ITraining[]> {
    return this.db.list(`trainingsPerTrains/${trainId}`)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots.map(({key}) => key)),
        map(trainingIds => trainingIds.map(trainingId => this.getTrainingStreamById(trainingId))),
        switchMap(trainingStreams => trainingStreams.length !== 0 ? combineLatest(trainingStreams) : of([])),
      );
  }

  addTraining(training: ITraining, trainId: string): Observable<any> {
    return of(this.db.list('trainings').push(training))
      .pipe(
        map(({key}) => ({[key]: true})),
        switchMap(dataToUpdate => this.db.object(`trainingsPerTrains/${trainId}`).update(dataToUpdate))
      );
  }


  deleteTraining(trainingId: string, trainId: string) {
    of(this.db.object(`trainingsPerTrains/${trainId}/${trainingId}`).remove())
      .pipe(
        switchMap(() => this.db.object(`trainings/${trainingId}`).remove())
      )
      .subscribe();
  }

  private getTrainingStreamById(trainingId: string): Observable<ITraining> {
    return this.db.object<ITraining>(`trainings/${trainingId}`)
      .snapshotChanges()
      .pipe(
        map(({key, payload}) => ({id: key, ...payload.val()}))
      );
  }
}
