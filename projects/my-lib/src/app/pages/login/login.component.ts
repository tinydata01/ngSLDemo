import { Component, OnInit } from "@angular/core";
import { FormDefinationService } from "../../services/form-defination.service";
import { HttpService } from "../../services/http.service";
import { Router } from "@angular/router";
import { LoaderService } from "../../services/loader.service";
import { MyLibService as OnemoneyWebsdkService } from '../../../lib/my-lib.service';
import {
  toastStatuses
} from "../../components/toast/toast.component";
import {
  eventsList,
  pageViewList
} from "../../constants/analytics-events.constants";
import { NavHandlerService } from "../../services/nav-handler.service";
import { appData, environment } from "../../../environments/environment";
import { DataService } from "../../services/data.service";
declare var createComponent: any, event: any, triggerCallback;
declare var window: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: any;
  consentId: any;
  logInData: any;

  constructor(
    public formDefinationService: FormDefinationService,
    private router: Router,
    private httpService: HttpService,
    private loader: LoaderService,
    private oneMoneyService: OnemoneyWebsdkService,
    private nav: NavHandlerService,
    private dataService: DataService
  ) {
    this.loginForm = this.formDefinationService.loginForm;
  }
  OTPInvalid = false;
  resendValue: any = [];
  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30
  };
  onOtpChange(e) {
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,

      this.OTPInvalid = false;
    } else {

      this.OTPInvalid = true;
    }
  }
  sessionId: any;

  ngOnInit() {
    localStorage.removeItem("LinkedAccounts");
    localStorage.removeItem("vuaData");
    localStorage.removeItem("sessionId");
    
  }

  /**
   * @desc To login user
   * @param  form
   */
  showOTPData: boolean = false;
  showAAHandle: boolean = false;
  userNumber: any;
  vuaExtension = "@onemoney";
  vuaData: any;
  otpData: any;
  loginUser(loginData) {
    this.httpService.showThrobber();
    let form = loginData.formData;
    if (form.valid) {
      var data = {
        username: form.controls.vua.value,

        //password: form.controls.otp.value
      };

      localStorage.setItem("mobileNumber", data.username);
      this.userNumber = localStorage.getItem("mobileNumber");
      this.vuaData = this.userNumber + this.vuaExtension;
      localStorage.setItem("vuaData", this.vuaData);
  //     this.oneMoneyService.verifyVua("onemoney","b5577e63f4533dfee3e2a56e28483add9242e7eb",
  // "f48a09b6647814304e1eba09231d971709558e20a4c202acc97861a4af34b6ac59acc8f4",
  //  [{appIdentifier:"com.onemoney.app"}],{vua:'8919319136@onemoney'}).subscribe((res)=>{
  //   console.log(res)
  // })
  this.oneMoneyService.verifyVua("onemoney","b5577e63f4533dfee3e2a56e28483add9242e7eb",
  "f48a09b6647814304e1eba09231d971709558e20a4c202acc97861a4af34b6ac59acc8f4",
   [{appIdentifier:"com.onemoney.app"}],{vua:'8919319136@onemoney'}).subscribe(
          (response => {
            this.httpService.hideThrobber();
            if (response.status == true) {
              this.oneMoneyService.loginOTP(appData.organisationid, appData.client_id, appData.client_secret,
                [{ appIdentifier: appData.appIdentifier }], data.username).subscribe(res => {
                  this.otpData = res["otp_reference"];
                  this.loader.showToast(toastStatuses.SUCCESS, 'otpSentSuccessfully');
                  let loginData = {
                    username: form.controls.vua.value,
                    otp_reference: this.otpData,
                    code: "",
                    url: "login",
                  };
                  this.logInData = loginData;
                })
              this.showOTPData = true;
              this.showAAHandle = false;


            }
            else {
              this.showOTPData = false;
              this.showAAHandle = true;
              if (this.showAAHandle) {
                this.router.navigate(['/aahandle'])
              }
            }
          }));
   }
  }

  

  /**
   * Navigate the user to login
   */
  gotoSignup() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (environment.library) {
      createComponent("signup");
    } else {
      this.router.navigate(["/auth/signup"]);
    }
  }
  hideVerifyOTP() {
    this.showOTPData = false;
  }


  ngOnDestroy() {
    this.loginForm.formGroup.reset();
  }
}
