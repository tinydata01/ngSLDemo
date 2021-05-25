import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
// import { OnemoneyWebsdkService } from 'onemoney-headless-websdk';
// import { UserService } from '../app/services/user.service';


@Component({
  selector: 'lib-my-lib',
  templateUrl: './my-lib.component.html',
  styles: []
})
export class MyLibComponent implements OnInit {

  isUserLoggedIn: boolean;
  isLoggedIn: boolean = false;
  companyLogo: any;
  sessionId: any;
  constructor() {
       }



  ngOnInit() {

  }
  logout() {
    // this.oneMoneyService.logout(this.sessionId).subscribe(res => {
    //   if (res.status == true) {
    //     localStorage.clear();
    //     this.router.navigate(['/login']);
    //     //this.loader.showToast(toastStatuses.SUCCESS, "userLogoutSuccessfully");
    //   }
    //   else {
    //    // this.loader.showToast(toastStatuses.ERROR, "somethingWentWrongPleaseRetryAfterAnHour");

    //   }


    // })


  }
 



}
