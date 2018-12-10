import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TrainListService} from './train-list.service';
import {takeUntil} from 'rxjs/operators';
import {ITrain} from '../model/ITrain';

@Component({
  selector: 'tfs-train-list',
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.css']
})
export class TrainListComponent implements OnInit {
  trains$: Observable<ITrain[]>;
  private destroy$ = new Subject<void>();

  constructor(private trainListService: TrainListService) { }

  ngOnInit() {
    this.trains$ = this.trainListService.getTrains();

  }

  ngOnDestroy() {
    this.destroy$.next();
  }


  addWallet() {
    this.trainListService.addTrain()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
