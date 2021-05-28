import { APP_INITIALIZER,CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
//import { MainModule } from './main.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { environment } from '../environments/environment';
//import { AppRoutingModule } from './app-routing.module';
import { CustomDashboardModule } from '../custom-dashboard/custom-dashboard.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// export function initializeApp(userService: UserService) {
//   return (): Promise<any> => {
//     return userService.load();
//   }
// }

@NgModule({
  declarations: [MyLibComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    CustomDashboardModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [CustomDashboardModule],
  //bootstrap: [MyLibComponent],
  exports: [MyLibComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MyLibModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', 'en.json');
}