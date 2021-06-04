import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { HttpService } from '../../../../services/http.service';
import { LoaderService } from '../../../../services/loader.service';
import { toastStatuses } from '../../../../components/toast/toast.component';
import { LinkingStepperHelperService } from "../../services/linking-stepper-helper.service";
import { MyLibService as OnemoneyWebsdkService } from '../../../../../lib/my-lib.service';
import { UserService } from '../../../../services/user.service';
import { Router } from "@angular/router";
@Component({
  selector: "app-discover-accounts",
  templateUrl: "./discover-accounts.component.html",
  styleUrls: ["./discover-accounts.component.scss"]
})
export class DiscoverAccountsComponent implements OnInit {
  @ViewChild("mycheckbox", { static: false }) mycheckbox;
  accountsData: any
  FIs: any = [];
  userMobileNumber: any;
  checkCurrentAccount: boolean = true;
  checkSavingAccount: boolean = true;
  AccountDiscoveriesSkipped = 0;
  btnDisabled: boolean = true;
  @Input() discoveredAccountsLength: any;
  @Input() discoveredAccounts: any;

  @Input() set selectedFIs(value: any) {
    if (value) {
      // this.getDiscoveredAccounts(value);
      // this.FIs = value;
    }
  }
  userNumber: any;
  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30,
    reset: false
  };
  vuaData: any;
  linkedAccounts: any;
  displayOTP: boolean[] = [];
  accountList: any[] = [];
  bankName: string;
  constructor(private httpService: HttpService, private linkingStepper: LinkingStepperHelperService, private router: Router,
    private loader: LoaderService, private oneMoneyService: OnemoneyWebsdkService, private userService: UserService) {
    this.bankName = 'HDFC';
  }

  linkedAccountsLength = 0;
  ngOnInit() {
    // this.getListOfLinkedAccounts();
    this.userMobileNumber = localStorage.getItem("mobileNumber");
    this.vuaData = localStorage.getItem("vuaData");
    this.getRequestConsent();


  }


  ngDoCheck() {
    if (this.accountList.length > 0) {
      if (this.mycheckbox.nativeElement.checked) {
        this.btnDisabled = false;
      }
    }
    else {
      this.btnDisabled = true;
    }
  }

  displayLinked: boolean[] = [];
  checkAccountsLinked: any;
  keyDownFunction(event, i) {

    // let OTPContainer = event.target.parentElement;
    // let inputElement = OTPContainer.querySelectorAll("input");
    // let typedWord = 0;

    // for (let i = 0; i < inputElement.length; i++) {
    //   typedWord += inputElement[i].value != "" ? 1 : 0;
    // }
    // if (typedWord === 6) {
    //   this.displayLinked[i] = true;
    //   this.displayOTP[i] = false;
    //   this.sendOtp(this.accountList);
    // }
    // else {
    //   this.submitted = true;
    // }
    if (event.key == "Enter") {
      this.sendOtp(i);
    }
  }
  accountCheck(e, accRefNumber, i, j, flag) {

    if (e.target.checked) {
      if (flag == "LinkedAccount") {
        this.accountList.push(this.linkedAccounts[i].itm[j]);
      }
      else {
        this.accountList.push(this.discoveredAccounts[i].itm[j]);
      }
      this.accountListArray();
    }
    else {
      let acb = this.accountList.findIndex(x => x.accRefNumber == accRefNumber);
      if (acb == -1) {
        this.accountList.splice(acb, 1);
      }
    }
  }
  accountListArray() {
    var accountToLink = [{
      type: '',
      data: {
        accType: '',
        accRefNumber: '',
        maskedAccNumber: '',
        fipId: '',
        userInfo: {}
      }
    }];
    this.accountList.forEach((item) => {
      if (item.hasOwnProperty('data')) {
        accountToLink.push(item);
      }
      else {
        accountToLink.push({
          type: item.accType,
          data: {
            accType: item.accType,
            accRefNumber: item.accRefNumber,
            maskedAccNumber: item.maskedAccNumber,
            fipId: item.fipId,
            userInfo: {}
          }
        })
      }

    })
    accountToLink.splice(0, 1);
    this.checkAccountsLinked = { 'accounts': accountToLink };
  }
  sendOTPToLink(i, flag) {
    // this.btnDisabled = false;
    this.displayOTP[i] = true;
    var accountToLink = [{
      type: '',
      data: {
        accType: '',
        accRefNumber: '',
        maskedAccNumber: '',
        fipId: '',
        userInfo: {}
      }
    }];
    this.accountList.forEach(item => {
      accountToLink.push({
        type: item.accType,
        data: {
          accType: item.accType,
          accRefNumber: item.accRefNumber,
          maskedAccNumber: item.maskedAccNumber,
          fipId: item.fipId,
          userInfo: {}
        }
      })
    })
    accountToLink.splice(0, 1);
    let accounts = { 'accounts': accountToLink };
    if (accountToLink.length != 0) {
      this.oneMoneyService.multiAccountlink(accounts).subscribe(res => {
        this.dataVerify = res;
        if (flag == "sendOTP") {
          this.loader.showToast(toastStatuses.SUCCESS, 'otpSentSuccessfully');
        }
        else {
          this.settings.reset = true;
          this.submitted = false;
          this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully');
        }
      })
      this.accountList = accountToLink;
    }
    else {
      this.displayOTP[i] = false;
      this.loader.showToast(toastStatuses.ERROR, "pleaseSelectOneAccountAtleast");
    }

  }
  dataVerify: any;
  enteredOtp: any = '';
  onInputChange(e) {
    this.enteredOtp = '';
    this.submitted = false;
    if (e.length == this.settings.length) {
      this.enteredOtp = e;
    }
    // this.enteredOtp = ''
    // if (e.length == this.settings.length) {
    //   // e will emit values entered as otp and,
    //   this.enteredOtp = e;
    // } else if (e == -1) {
    //   // if e == -1, timer has stopped
    //   //   console.log(e, "resend button enables");
    // } else if (e == -2) {
    //   // e == -2, button click handle
    //   //   console.log("resend otp");
    // }
  }


  /**
   * to send otp for sbi account verfification
   * @param selectedAccount
   */
  submitted = false;

  sendOtp(i) {

    let checkboxes = document.querySelectorAll(`[id^='discovered${i}']`);
    for (let index = 0; index < checkboxes.length; index += 1) {
      let checkbox = <HTMLInputElement>checkboxes[index];
      if (checkbox.checked == true) {
        checkbox.disabled = true;
      }
    }
    this.httpService.showThrobber();

    //this.dataVerify.authSessionParameters["refNumber"] = "agagaha";
    if (this.enteredOtp && this.enteredOtp.length == this.settings.length) {
      this.oneMoneyService.accountVerify(this.dataVerify.authSessionParameters["refNumber"], this.enteredOtp, this.sessionId)
        .subscribe(res => {
          if (res.status == "SUCCESS") {
            this.displayLinked[i] = true;
            this.displayOTP[i] = false;
            this.loader.showToast(toastStatuses.SUCCESS, 'accountLinkedSuccessfully');
            this.httpService.hideThrobber();
          }
          else {
            this.submitted = true;
            this.enteredOtp = null;
            this.httpService.hideThrobber();
            //this.loader.showToast(toastStatuses.ERROR, 'unableToLinkOneOrMoreAccountsPleaseTryAgainLater');

          }
        })
    }
    else {
      this.submitted = true;
      this.enteredOtp = null;
      this.httpService.hideThrobber();
    }

  }
  actionKey: string;
  showVpinPopup: boolean = false;
  consentActionSubmitted = false;
  consentActionOtp: string = '';

  onConsentActionClicked(key: string, flag) {
    this.actionKey = key;
    this.sendConsentOTP(flag);
  }
  sendConsentOTP(flag) {
    let body = {
      actionType: this.actionKey,
      identifierValue: "MOBILE",
      identifierType: this.userMobileNumber
    }
    this.oneMoneyService.consentOTP(body)
      .subscribe(res => {

        if (flag == "sendOTP") {
          this.loader.showToast(toastStatuses.SUCCESS, 'otpSentSuccessfully');
        }
        else {
          this.settings.reset = true;
          this.consentActionSubmitted = false;
          this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully');
        }
        this.showVpinPopup = true;
      })
  }

  onPinChange(e) {
    this.consentActionOtp = ''
    this.consentActionSubmitted = false;
    if (e.length == this.settings.length) {
      this.consentActionOtp = e;
    }
  }
  closeVpinPopup() {
    this.showVpinPopup = false;
    this.consentActionSubmitted = false;

  }
  redirectMe: boolean = false;
  consentHandle: any = [];
  performAction() {

    this.consentActionSubmitted = true;
    this.consentHandle = localStorage.getItem("consentHandle");
    if (this.consentActionOtp && this.consentActionOtp.length == this.settings.length) {
      if (this.actionKey === 'CONSENT_CONFIRMED') {
        let body = {
          consentHandle: this.consentHandle,
          otp: this.consentActionOtp,
          accounts: this.checkAccountsLinked.accounts,

        };

        this.oneMoneyService.approve(body)
          .subscribe(res => {
            console.log("APPROVE", res)
            if (res.status == "SUCCESS") {
              this.loader.showToast(toastStatuses.SUCCESS, 'consentRequestAcceptedSuccessfully');
              this.router.navigate(['/welcome-screen']);
            } else {
              this.consentActionSubmitted = true;
              this.consentActionOtp = null;
              this.settings.reset = true;
            }
          })
      } else {
        let body = {
          consentHandle: this.consentHandle,
          otp: this.consentActionOtp
        }

        this.oneMoneyService.reject(body)
          .subscribe(res => {
            if (res.status == "SUCCESS") {
              this.loader.showToast(toastStatuses.SUCCESS, 'consentRejectedSuccessfully');
              this.showVpinPopup = false;
              this.router.navigate(['/welcome-screen']);
            } else {
              this.consentActionSubmitted = true;
              this.consentActionOtp = null;
              this.settings.reset = true;
            }
          })
      }
    }
    else {
      this.loader.showToast(toastStatuses.ERROR, 'somethingWentWrongUnableToUpdateConsentStatus');
    }
  }


  discoverAccount() {
    this.oneMoneyService.getDiscoveredAccountList().subscribe(response => {

    })
  }
  showDetail: boolean = false;
  consentDetails: any;
  sessionId: any;
  consentHandleString: string[];
  showConsentDetail() {
    this.showDetail = true;
    this.consentHandleString = Array(localStorage.getItem("consentHandle"));
    this.sessionId = localStorage.getItem("sessionId");
    this.oneMoneyService.getConsentDetails({ consentHandles: this.consentHandleString }, this.sessionId).subscribe(res => {
      if (res.status == "SUCCESS") {
        this.consentDetails = res.consentDetails;
      }
      else {
        this.loader.showToast(toastStatuses.ERROR, 'consentDetailsNotFound');
      }

    })
  }
  hideConsentDetail() {
    this.showDetail = false;
  }
  changeAuthorizeEvent() {
    if (this.mycheckbox.nativeElement.checked) {
      this.btnDisabled = false;
    }
    else {
      this.btnDisabled = true;
    }
  }
  getListOfLinkedAccounts() {
    this.oneMoneyService.getListOfLinkedAccounts(this.sessionId).subscribe(res => {
      this.linkedAccounts = res.accounts;
      var account = this.linkedAccounts.map(x => x.data);
      this.linkedAccounts = account.map((item) => item.fipId).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        let new_list = account.filter(itm => itm.fipId == item).map(itm => itm);
        return { fipId: item, itm: new_list }
      });
      this.linkedAccountsLength = this.linkedAccounts.length;
    })
  }
  getRequestConsent() {
    // this.httpService.requestConsent(this.userMobileNumber, this.vuaData).subscribe(res => {
    //   if (localStorage.getItem("consentHandle") == "") {
    //     localStorage.setItem("consentHandle", res.data.consent_handle);
    //     this.showConsentDetail();
    //   }
    //   else {
    //     localStorage.removeItem("consentHandle");
    //     localStorage.setItem("consentHandle", res.data.consent_handle);
    //     this.showConsentDetail();
    //   }

    // })
  }
}
