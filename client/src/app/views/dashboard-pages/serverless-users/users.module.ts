import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedUiModule } from 'src/app/shared-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    DataTablesModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule
  ],
  providers: []
})
export class UsersModule { }
