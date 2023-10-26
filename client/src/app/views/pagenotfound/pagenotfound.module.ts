import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagenotfoundRoutingModule } from './pagenotfound-routing.module';
import { PagenotfoundComponent } from './pagenotfound.component';
import { SharedUiModule } from 'src/app/shared-ui';


@NgModule({
  declarations: [
    PagenotfoundComponent
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    PagenotfoundRoutingModule
  ]
})
export class PagenotfoundModule { }
