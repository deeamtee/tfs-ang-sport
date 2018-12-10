import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrainComponent} from './train.component';
import { TrainingPreviewComponent } from './training-preview/training-preview.component';
import {AddTrainModule} from '../add-train/add-train.module';
import {PipeModule} from '../pipe/pipe.module';
import {TrainingService} from './training.service';
import {SettingsModule} from '../settings/settings.module';

@NgModule({
  declarations: [TrainComponent, TrainingPreviewComponent],
  exports: [TrainComponent],
  imports: [
    CommonModule,
    AddTrainModule,
    SettingsModule
  ],
  providers: [
    TrainingService
  ]
})
export class TrainModule { }
