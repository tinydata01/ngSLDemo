import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";

import { HttpService } from "../../services/http.service";
import { CommonService } from "../../services/common.service";
import { LoaderService } from '../../services/loader.service';
import { toastStatuses } from '../toast/toast.component';
import { environment, appData } from '../../../environments/environment';
import { MyLibService as OnemoneyWebsdkService } from '../../../lib/my-lib.service';
import { UserService } from "../../services/user.service";
declare var webSDKCustomCss;

@Component({
  selector: "app-verify-mobile-number",
  templateUrl: "./verify-mobile-number.component.html",
  styleUrls: ["./verify-mobile-number.component.scss"]
})
export class VerifyMobileNumberComponent implements OnInit {
  @Input() signupData: any;
  @Input() logInData: any;
  userMobileNumber: any;
  bankName: string;
  submitted: boolean = false;
  constructor(
    private httpService: HttpService,
    private oneMoneyService: OnemoneyWebsdkService,
    public commonService: CommonService,
    private loader: LoaderService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.bankName = 'HDFC';
    if (environment.library) { webSDKCustomCss(); }
  }
  enteredOtp: any = "";
  userName;
  userNumber;
  isVerificationPage = true;
  //   isVerificationPage = false;
  correctOtp = true;
  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30,
    reset: false
  };
  showOTPField = true;
  ngOnInit() {
    this.userMobileNumber = localStorage.getItem("mobileNumber");
    setTimeout(() => {
      this.userName = this.commonService.userDetails.userName;
      this.userNumber = this.commonService.userDetails.userNumber;
    });
    setTimeout(() => {
      this.userName = this.commonService.userDetails.userName;
      this.userNumber = this.commonService.userDetails.userNumber;
      this.changeDetector.detectChanges();
    });
  }

  /**
   *
   * @param e
   */
  onInputChange(e) {
    this.enteredOtp = '';
    //this.settings.reset = false;
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      this.enteredOtp = e;
    } else if (e == -1) {
      // if e == -1, timer has stopped
      //   console.log(e, "resend button enables");
    } else if (e == -2) {
      // e == -2, button click handle
      //   console.log("resend otp");
    }
  }
  sessionId: any;
  linkedAccountLength: any;
  showErrorMessage: boolean = false;
  sendOtp() {
    this.submitted = true;
    if (this.enteredOtp.length == this.settings['length']) {
      let data = {
        username: this.userNumber,
        code: this.enteredOtp
      };

      if (this.logInData) {
        this.oneMoneyService.loginOTPVerify(appData.organisationid, appData.client_id, appData.client_secret,
          [{ appIdentifier: appData.appIdentifier }], this.userMobileNumber, this.logInData.otp_reference, data.code)
          .subscribe(res => {
            localStorage.removeItem("sessionId");
            localStorage.setItem("sessionId", res["sessionId"]);
            this.router.navigate(['/account-link']);
          },
            (err) => {
              this.submitted = true;
              this.enteredOtp = null;
              this.loader.showToast(toastStatuses.ERROR, "yourEnteredOtpIsInvalidPleaseTryAgain");
            })
      }
      else {
        let signupData = {
          phone_number: this.userMobileNumber,
          otp_reference: this.signupData.otp_reference,
          code: data.code
        }
        this.oneMoneyService.verifyOtp(appData.organisationid, appData.client_id, appData.client_secret,
          [{ appIdentifier: appData.appIdentifier }], signupData).subscribe(result => {
            localStorage.removeItem("sessionId");
            localStorage.setItem("sessionId", result["sessionId"]);
            this.router.navigate(['/account-link']);
          },
            (err) => {
              this.submitted = true;
              this.enteredOtp = null;
              this.settings.reset = true;
              this.loader.showToast(toastStatuses.ERROR, "yourEnteredOtpIsInvalidPleaseTryAgain");
            })
      }

    }
  }
  otpData: any;
  vuaExtension = "@onemoney";
  vuaData: any;

  resendOtp() {
    this.settings.reset = true;
    this.submitted = false;
    this.enteredOtp = '';
    if (this.logInData) {

      this.oneMoneyService.loginOTP(appData.organisationid, appData.client_id, appData.client_secret,
        [{ appIdentifier: appData.appIdentifier }], this.logInData.username).subscribe(res => {
          this.otpData = res["otp_reference"];
          this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully');
          let loginData = {
            username: this.logInData.username,
            otp_reference: this.otpData,
            code: "",
            url: "login",
          };
          this.logInData = loginData;
        })
    }
    else {

      this.vuaData = this.signupData.phone_number + this.vuaExtension;
      this.oneMoneyService.userRegistration(appData.organisationid, appData.client_id, appData.client_secret,
        [{ appIdentifier: appData.appIdentifier }], this.signupData).subscribe(response => {
          this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully');
          let signupData = {
            name: this.signupData.name,
            phone_number: this.signupData.phone_number,
            terms_and_conditions: this.signupData.terms_and_conditions,
            otp_reference: response.otp_reference,
            vua: this.vuaData,
            url: "signup"
          };

          this.signupData = signupData;

        });

    }
  }
  keyDownFunction(event) {
    if (event.key == "Enter") {
      this.sendOtp();
    }
  }


}
