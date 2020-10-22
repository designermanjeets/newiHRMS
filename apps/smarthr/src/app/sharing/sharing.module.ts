import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../assets/pipes/custom-date.pipe';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [CustomDatePipe],
  exports: [
    CustomDatePipe,
    MatSelectModule
  ],
  imports: [
    CommonModule,
    MatSelectModule
  ]
})
export class SharingModule { }
