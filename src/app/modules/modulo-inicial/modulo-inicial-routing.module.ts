import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramiteComponent } from './tramite/tramite.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent
  },
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
