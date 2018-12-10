import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserPipe} from './user.pipe';
import { WelcomePipe } from './welcome.pipe';

@NgModule({
  declarations: [UserPipe, WelcomePipe],
  exports: [UserPipe, WelcomePipe],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
