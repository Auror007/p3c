import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginotpPage } from './loginotp.page';

const routes: Routes = [
  {
    path: '',
    component: LoginotpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginotpPageRoutingModule {}
