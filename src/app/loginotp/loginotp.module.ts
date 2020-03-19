import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginotpPageRoutingModule } from './loginotp-routing.module';

import { LoginotpPage } from './loginotp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginotpPageRoutingModule
  ],
  declarations: [LoginotpPage]
})
export class LoginotpPageModule {}
