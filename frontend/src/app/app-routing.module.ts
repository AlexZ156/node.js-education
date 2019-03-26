import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
