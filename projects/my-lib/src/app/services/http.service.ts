import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError as observableThrowError, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { LoaderService } from "./loader.service";
import { utilService } from "./util.service";
import { UserService } from "./user.service";
import {
  toastStatuses
} from "../components/toast/toast.component";
import { appData, environment } from '../../environments/environment';
import { EnvService } from '../services/env.service';
//import { rejects } from "assert";

// constant

const APIList = {
  // server URL

  login: "user/login",
  mobileOtp: "user/otp",
  dashboardJson: "dashboard",
  consentDashboardJson: "consent-dashboard",
  vua: "user/setvua",
  signup: "user/signup",
  userconsent: "app/consent",
  consentconfirm: "app/consent/confirm",
  consentHandle: "app/consent",
  consentUpdate: "app/consent/update",

  accountdiscover: "app/accounts/discover",
  discoverOtp: "app/otp/validate",
  accountOtp: "app/accounts/otp",
  accountlink: "app/accounts/link",
  accountDelink: "app/accounts/delink",
  accountlinkconfirm: "app/accounts/confirm-token",

  dashboard: "app/dashboard",
  discoveredAccounts: "app/dashboard?calltype=discovery",
  notification: "aa/notification",
  banklogo: "bankList",
  userIdentifier: "user/identifier",
  fipList: "app/fip",
  fiuList: "app/fiu",
  changeconsentpin: "user/change-password",
  createconsentpin: "app/consent/pin",
  consentHistory: "app/consent/history",
  consentTimeline: "consentTimeline",
  userInfo: "user/info", //Not usign
  forgotPassword: "user/forgot-password",
  confirmPassword: "user/forgot-password/confirm",
  consentStatusUpdateOtp: "app/otp/send",
  consentStatusUpdate: "app/consent/status/update",
  Consent: "app/consent",
  consentDetail: "Consent/68a4ad75-cf09-4095-9445-b5fb8861493e",
  profile: "user/user-profile",
  activityLog: "app/activity-log",
  deactivateAAAcount: "user/de-registration"
};

const APIList2 = {
  // server URL

  login: "user/login",
  mobileOtp: "user/otp",
  dashboardJson: "dashboard",
  consentDashboardJson: "consent-dashboard",
  vua: "user/setvua",
  signup: "user/signup",
  userconsent: "app/consent",
  consentconfirm: "app/consent/confirm",
  consentHandle: "app/consent",
  consentUpdate: "app/consent/update",

  accountdiscover: "app/accounts/discover",
  discoverOtp: "app/otp/validate",
  accountOtp: "app/accounts/otp",
  accountlink: "app/accounts/link",
  accountDelink: "app/accounts/delink",
  accountlinkconfirm: "app/accounts/confirm-token",

  dashboard: "app/dashboard",
  discoveredAccounts: "app/dashboard?calltype=discovery",
  notification: "aa/notification",
  banklogo: "bankList",
  userIdentifier: "user/identifier",
  fipList: "app/fip",
  fiuList: "app/fiu",
  changeconsentpin: "user/change-password",
  createconsentpin: "app/consent/pin",
  consentHistory: "app/consent/history",
  consentTimeline: "consentTimeline",
  userInfo: "user/info", //Not usign
  forgotPassword: "user/forgot-password",
  confirmPassword: "user/forgot-password/confirm",
  consentStatusUpdateOtp: "app/otp/send",
  consentStatusUpdate: "app/consent/status/update",
  Consent: "app/consent",
  consentDetail: "Consent/68a4ad75-cf09-4095-9445-b5fb8861493e",
  profile: "user/user-profile",
  activityLog: "app/activity-log",
  deactivateAAAcount: "user/de-registration"
};

@Injectable({
  providedIn: "root"
})
export class HttpService {
  url: string;
  serverUrl: string;
  localUrl: string;
  developerUrl: string;
  headers: any;
  loading = {};
  activeAPICalls: any;
  apiURL: string = 'https://uat.moneyone.in/finpro_uat/v2/requestconsent';

  constructor(
    private http: HttpClient,
    private loader: LoaderService,
    private utils: utilService,
    private userService: UserService,
    private envService: EnvService
  ) {
    this.localUrl = "assets/json-data/";
    this.serverUrl = "https://dev.onemoney.in/";
    // this.developerUrl = "https://app-perf.onemoney.in/";
    // this.developerUrl = "https://app-per.onemoney.in/";
    // this.developerUrl = "https://app-uat.onemoney.in/";
    this.developerUrl = this.envService.apiUrl;
    if (environment.library) {
      this.developerUrl = this.envService.omApiUrl;
    }
    // this.developerUrl = "https://4px158ie25.execute-api.ap-south-1.amazonaws.com/divami/";
  }

  /**
   *
   * @param options - object for Http Request
   * options={
   * type   : enum('GET','POST','PUT','DELETE'),
   * url    : string [httpUrl keyword],
   * isLocal: boolean [local API call or server call (optional)]
   * isDeveloper:boolean [developer API call or server call (optional)]
   * data   : json [data for post or put call]
   * }
   */
  makeHttpRequest(options) {
    //Showing loader
    this.showThrobber();
    this.url = this.getApiUrl(options);

    this.headers = this.requestHeader(options);
    var data: any = {
      headers: this.headers,
      params: options.params ? options.params : null,
      body: options.body ? options.body : null
    };

    try {
      // this.utils.commonConfig.isLoader = true
      return this.http
        .request(options.type, this.url, data)
        .pipe(
          map(res => {
            this.hideThrobber();
            this.checkForSessionError(res);
            delete this.loading[this.url];
            let loadings = Object.keys(this.loading);
            if (!(loadings && loadings.length)) {
              // this.utils.commonConfig.isLoader = false;
            }
            let response: any = res;
            return response;
          })
        )
        .pipe(catchError(this.handleError.bind(this)));
    } catch (error) {
      //   console.log(error);
    }
  }

  /**
   *
   * @param options - object for Http Request
   * options={
   * type   : enum('GET','POST','PUT','DELETE'),
   * url    : string [httpUrl keyword],
   * isLocal: boolean [local API call or server call (optional)]
   * isDeveloper:boolean [developer API call or server call (optional)]
   * data   : json [data for post or put call]
   * }
   */
  makeHttpRequestWOLoader(options) {
    this.url = this.getApiUrl(options);

    this.headers = this.requestHeader(options);

    var data: any = {
      headers: this.headers,
      params: options.params ? options.params : null,
      body: options.body ? options.body : null
    };

    try {
      // this.utils.commonConfig.isLoader = true
      return this.http
        .request(options.type, this.url, data)
        .pipe(
          map(res => {
            this.checkForSessionError(res);
            delete this.loading[this.url];
            let loadings = Object.keys(this.loading);
            if (!(loadings && loadings.length)) {
              // this.utils.commonConfig.isLoader = false;
            }
            let response: any = res;
            return response;
          })
        )
        .pipe(catchError(this.handleError.bind(this)));
    } catch (error) {
      //   console.log(error);
    }
  }

  handleError(obj) {
    this.checkForSessionError(obj.error);
    this.hideThrobber();
    // this.utils.commonConfig.isLoader = false;
    // console.log(obj.error);
    return of({ status: false, errorMessage: obj.error.errorMessage, errorCode: obj.error.errorCode });
  }

  /**
   *
   * @param options :{Object}
   * options={
   * type   : enum('GET','POST','PUT','DELETE'),
   * url    : string [httpUrl keyword],
   * isLocal: boolean [local API call or server call (optional)]
   * isDeveloper: boolean [development URL],
   * pathVariables:Array for path Variables
   * data   : json [data for post or put call]
   * }
   */

  getApiUrl(options) {
    if (options.url) {
      let url;
      // local APi call
      if (APIList[options.url]) {
        if (options.isLocal != undefined && options.isLocal == true) {
          url = this.localUrl + APIList[options.url] + ".json";
        } else if (
          options.isDeveloper != undefined &&
          options.isDeveloper == true
        ) {
          // This is to handle temporary change in API paths by Ramesh
          if (
            this.developerUrl.indexOf("perf.onemoney") >= 0 ||
            this.developerUrl.indexOf("dev.onemoney") >= 0 ||
            this.developerUrl.indexOf("test.onemoney") >= 0 ||
            this.developerUrl.indexOf("per.onemoney") >= 0 ||
            this.developerUrl.indexOf("sandbox.onemoney") >= 0 ||
            this.developerUrl.indexOf("demo.onemoney") >= 0 ||
            this.developerUrl.indexOf("uat.onemoney") >= 0 ||
            this.developerUrl.indexOf("aa-app.onemoney") >= 0
          ) {
            url = this.developerUrl + APIList2[options.url];
          } else {
            url = this.developerUrl + APIList[options.url];
          }
        } else {
          //server Call
          url = this.serverUrl + APIList[options.url];
        }
        if (!options.isLocal && options.pathVariables) {
          options.pathVariables.forEach(element => {
            url += "/" + element;
          });
        }
        return url;
      } else {
        // console.log("Path could not be found in the list");
        return "Path could not be found in the list";
      }
    } else {
      //   console.log("Path not Defined");
      return "Path not Defined";
    }
  }

  requestHeader(options) {
    let header;
    var sessionId = this.utils.getItemFromLocalStorage("sessionId");
    if (options.includeUserSession) {
      header = new HttpHeaders({
        sessionId: sessionId,
        "Content-Type": "application/json"
      });
    } else {
      header = new HttpHeaders({
        "Content-Type": "application/json"
      });
    }
    return header;
  }
  requestConsent(mobileNumber, vua) {
    let header;
    header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      'organizationId': 'finprobank',
      'client_id': '27cb60c4a421611872b7b352aa7a78c1dfecb1d1',
      'client_secret': 'ec64eb9efb18d530c52552f2e13d856e0d2ced68',
      'appIdentifier': 'com.moneyone.app'
    })

    let body = {
      accountID: "123456",
      partyIdentifierType: "MOBILE",
      partyIdentifierValue: mobileNumber,
      productID: "prod276",
      vua: vua
    }
    //return this.http.post('https://uat.moneyone.in/finproadminserver_uat/finpro_admin/v1/v2/requestconsent', body, { headers: header }).pipe(
    //  return this.http.post(this.userService.data["finproURL"], body, { headers: header }).pipe(
    //   map(res => {
    //     let response: any = res;
    //     return response;
    //   })
    // )

  }
  errorHandler(obj) { }

  showThrobber() {
    //  this.loader.setwebSdkShowMessage("");
    this.loader.toggleLoader(true);
    // this.activeAPICalls++;
  }

  hideThrobber() {
    //this.activeAPICalls--;
    // if(this.activeAPICalls <= 0) {
    this.loader.toggleLoader(false);
    // }
  }

  checkForSessionError(res) {
    if (res.errorCode && res.errorCode == 'UNAUTHENTICATED') {
      this.userService.logoutUser();
      this.loader.showToast(toastStatuses.ERROR, "sessionExpiredPleaseLoginToContinue");
    }
  }

}
