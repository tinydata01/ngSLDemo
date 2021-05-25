import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDashboardComponent } from './custom-dashboard/custom-dashboard.component';

import { HttpClientModule } from '@angular/common/http';
import { OnemoneyWebsdkService } from 'onemoney-headless-websdk';

import { RouterModule, Routes } from '@angular/router';



// import the new component
//import { CustomDashboardComponent } from './customer-dashboard/customer-dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
 
    
  ],
  declarations: [
    CustomDashboardComponent,
      

  ],
  providers: [OnemoneyWebsdkService],
  exports: [
    CustomDashboardComponent,
     RouterModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})


export class CustomDashboardModule { }

