import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound.component';

const routes: Routes = [
  {
    path: '',
    component: PagenotfoundComponent,
    data: { title: 'Page not found' },
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagenotfoundRoutingModule { }
