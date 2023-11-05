import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainActivityComponent } from './component/main-activity/main-activity.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainActivityComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
