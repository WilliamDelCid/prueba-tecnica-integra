import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramiteComponent } from './tramite/tramite.component';

const routes: Routes = [
  {
    path:'tramite',
    component:TramiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloInicialRoutingModule { }
