import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ButtonComponent,
    ErrorPageComponent
  ],
  imports: [
    CommonModule,RouterModule
  ],
  exports:[
    ButtonComponent,ErrorPageComponent
  ]
})
export class SharedModule { }
