import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddTrainComponent} from './add-train.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AddTrainComponent],
  exports: [AddTrainComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AddTrainModule { }
