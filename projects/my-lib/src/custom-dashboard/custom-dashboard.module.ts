import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDashboardComponent } from './custom-dashboard/custom-dashboard.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyLibService as OnemoneyWebsdkService } from '../lib/my-lib.service';

import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from '../app/pages/authentication/authentication.component';
import { MessagesComponent } from '../app/components/popups/messages/messages.component';
import { ToastComponent } from '../app/components/toast/toast.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
//import { EmbedVideo } from 'ngx-embed-video';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../app/pages/login/login.component';
import { FormComponent } from '../app/util-components/form/form.component';
import { CustomOtpComponent } from '../app/util-components/custom-otp/custom-otp.component';
import { VerifyMobileNumberComponent } from '../app/components/verify-mobile-number/verify-mobile-number.component';
import { CustomOverlayComponent } from '../app/components/custom-overlay/custom-overlay.component';
import { LinkingStepperComponent } from '../app/pages/account-link/linking-stepper/linking-stepper.component';
import { DiscoverAccountComponent } from '../app/pages/account-link/components/discover-account/discover-account.component';
import { DiscoverAccountsComponent } from '../app/pages/account-link/components/discover-accounts/discover-accounts.component';
import { FiSmallCardComponent } from '../app/components/fi-small-card/fi-small-card.component';
import { FIListComponent } from '../app/pages/account-link/components/fi-list/fi-list.component';
// import { EnvService } from 'onemoney-headless-websdk/lib/env.service';



// import the new component
//import { CustomDashboardComponent } from './customer-dashboard/customer-dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    //EmbedVideo.forRoot(),


  ],
  declarations: [
    CustomDashboardComponent,
    AuthenticationComponent,
    MessagesComponent,
    ToastComponent,
    LoginComponent,
    FormComponent,
    CustomOtpComponent,
    VerifyMobileNumberComponent,
    CustomOverlayComponent,
    LinkingStepperComponent,
    DiscoverAccountComponent,
    DiscoverAccountsComponent,
    FiSmallCardComponent,
    FIListComponent
  ],
  providers: [OnemoneyWebsdkService,],
  exports: [
    CustomDashboardComponent,
    AuthenticationComponent,
    MessagesComponent,
    ToastComponent,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class CustomDashboardModule { }

