import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/home-pages/login/login.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/dashboard-layout/dashboard-layout.module')
        .then((m) => m.DashboardLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
