import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
//import { OnemoneyWebsdkService } from 'onemoney-headless-websdk';
//import {bankLogo} from '../../assets/images/pngs/HDFC-logo.png';
//Onemoney\Test Lib\ngSLDemo\projects\my-lib\src\assets\images\pngs\HDFC-logo.png
@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.scss']
})
export class CustomDashboardComponent implements OnInit {

    isUserLoggedIn: boolean;
    isLoggedIn: boolean = false;
    companyLogo: any;
    constructor( ) {
    
    }
  
    sessionId: any;
  ngOnInit() {
    this.companyLogo = "../../assets/images/pngs/HDFC-logo.png";
  }

}