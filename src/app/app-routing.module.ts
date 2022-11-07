import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/**
 * Components
 */
import { LayoutComponent } from './components/layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/Inicio' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'Inicio',
        component: InicioComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/Inicio',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
