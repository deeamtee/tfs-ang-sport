import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingsComponent} from './settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InfoService} from './info.service';

@NgModule({
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    InfoService
  ]
})
export class SettingsModule { }
