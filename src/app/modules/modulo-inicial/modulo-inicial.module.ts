import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModuloInicialRoutingModule } from './modulo-inicial-routing.module';
import { TramiteComponent } from './tramite/tramite.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TramiteComponent,
  ],
  imports: [
    CommonModule,
    ModuloInicialRoutingModule,NgxPaginationModule,SharedModule
  ]
})
export class ModuloInicialModule { }
