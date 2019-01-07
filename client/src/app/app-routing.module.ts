import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { GodModePageComponent } from './god-mode-page/god-mode-page.component';

const routes: Routes = [{
  path:'',component:HomePageComponent
},
{
  path:'god',component:GodModePageComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
