import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SummaryComponent } from 'src/app/summary/summary.component';
import { QueryComponent } from 'src/app/query/query.component';

const routes: Routes = [
  { path: 'summary', component: SummaryComponent },
  { path: 'query', component: QueryComponent },
  { path: '**', component: QueryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
