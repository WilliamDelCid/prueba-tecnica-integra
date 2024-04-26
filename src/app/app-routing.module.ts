import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from './layouts/skeleton/skeleton.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    component: SkeletonComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../app/modules/modulo-inicial/modulo-inicial.module').then((m) => m.ModuloInicialModule),
      },
    ]
  },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
