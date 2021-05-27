import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDashboardComponent } from './custom-dashboard/custom-dashboard.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OnemoneyWebsdkService } from 'onemoney-headless-websdk';

import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from '../app/pages/authentication/authentication.component';
import { MessagesComponent } from '../app/components/popups/messages/messages.component';
import { ToastComponent } from '../app/components/toast/toast.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
//import { EmbedVideo } from 'ngx-embed-video';
import { HttpLoaderFactory } from '../lib/main.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { LoginComponent } from '../app/pages/login/login.component';
import { FormComponent } from '../app/util-components/form/form.component';
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
    
  ],
  declarations: [
    CustomDashboardComponent,
    AuthenticationComponent,
    MessagesComponent,
    ToastComponent,
    LoginComponent,
    FormComponent,
    
          

  ],
  providers: [OnemoneyWebsdkService,],
  exports: [
    CustomDashboardComponent,
    AuthenticationComponent,
    MessagesComponent,
    ToastComponent,
    RouterModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})


export class CustomDashboardModule { }

