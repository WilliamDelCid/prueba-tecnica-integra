import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloInicialRoutingModule } from './modulo-inicial-routing.module';
import { TramiteComponent } from './tramite/tramite.component';


@NgModule({
  declarations: [
    TramiteComponent
  ],
  imports: [
    CommonModule,
    ModuloInicialRoutingModule
  ]
})
export class ModuloInicialModule { }
