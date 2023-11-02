import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { AuthGuard } from 'src/app/shared-ui';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    // data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'login',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../../views/home-pages/login/login.module'
          ).then((mod) => mod.LoginModule),
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../../views/dashboard-pages/users/users.module'
          ).then((mod) => mod.UsersModule),
      },
      {
        path: 'server-less',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../../views/dashboard-pages/serverless-users/users.module'
          ).then((mod) => mod.UsersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardLayoutRoutingModule { }
