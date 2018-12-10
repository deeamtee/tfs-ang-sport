import {Component, Input, OnInit} from '@angular/core';
import {NEVER, Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {ITraining} from '../model/i-training';
import {ITrain} from '../model/ITrain';
import {TrainingService} from './training.service';
import {TrainListService} from '../train-list/train-list.service';

@Component({
  selector: 'tfs-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {
  @Input() train: ITrain;

  trains$: Observable<ITraining[]>;
  isAddTrainingOpen = false;
  currentOpen = 0;

  private destroy$ = new Subject();
  private changeTitleSubject = new Subject<string>();

  constructor(private trainingService: TrainingService,
              private trainListService: TrainListService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.setUpNameChanges();

    if (this.train) {
      this.loadTrainings();
      return;
    }

    this.route.params.pipe(
      switchMap(({id}) => {
        if (id) {
          return this.trainListService.getTrainById(id);
        }

        return NEVER;
      }),
      takeUntil(this.destroy$)
    )
      .subscribe(train => {
        if (train) {
          this.train = train;
          this.loadTrainings();
          return;
        }

        this.router.navigate(['trains']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  toggleAdd() {
    this.isAddTrainingOpen = !this.isAddTrainingOpen;
  }

  onAddTraining(training: ITraining) {
    this.trainingService.addTraining(training, this.train.id)
      .subscribe(() => {
        this.toggleAdd();
      });
  }

  loadTrainings() {
    this.trains$ = this.trainingService.loadTraining(this.train.id);
    // this.balance$ = this.trains$
    //   .pipe(
    //     map(trainings => this.train.amount - TrainingService.calcTotal(trainings)),
    //     startWith(this.train.amount)
    //   );
  }

  isCurrentOpen(index: number) {
    return index === this.currentOpen;
  }

  setCurrentOpen(index: number) {
    if (this.currentOpen === index) {
      this.currentOpen = null;
      return;
    }

    this.currentOpen = index;
  }

  onPreviewDelete(training: ITraining) {
    this.trainingService.deleteTraining(training.id, this.train.id);
  }

  changeTitle(title: string) {
    this.changeTitleSubject.next(title);
  }

  private setUpNameChanges() {
    this.changeTitleSubject
      .pipe(
        map(name => name.trim()),
        filter(name => !!name),
        map(name => name.length <= 20 ? name : name.substr(0, 20)),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => this.trainListService.updateTrain({...this.train, name}))
      )
      .subscribe((res) => {
        console.log('--- res', res);
      });

  }
}
