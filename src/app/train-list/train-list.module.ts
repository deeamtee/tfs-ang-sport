import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrainListService} from './train-list.service';
import {TrainModule} from '../train/train.module';
import {TrainListComponent} from './train-list.component';

@NgModule({
  declarations: [TrainListComponent],
  exports: [TrainListComponent],
  providers: [TrainListService],
  imports: [
    CommonModule,
    TrainModule
  ]
})
export class TrainListModule { }
