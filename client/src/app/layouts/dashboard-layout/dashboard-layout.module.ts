import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutRoutingModule } from './dashboard-layout-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { DashboardTopnavComponent } from '../dashboard-topnav/dashboard-topnav.component';
import { LoadingComponent } from 'src/app/shared-ui/loading/loading.component';
import { SharedUiModule } from 'src/app/shared-ui';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    DashboardTopnavComponent,
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    DashboardLayoutRoutingModule
  ]
})
export class DashboardLayoutModule { }
