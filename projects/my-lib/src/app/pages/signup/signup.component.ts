import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormDefinationService } from "../../services/form-defination.service";
import { HttpService } from "../../services/http.service";
import { CommonService } from "../../services/common.service";
// import { LoaderService } from 'src/app/services/loader.service';
// import { toastStatuses } from 'src/app/components/toast/toast.component';
import { LoaderService } from '../../services/loader.service';
import { toastStatuses } from '../../components/toast/toast.component';
// import { pageViewList } from 'src/app/constants/analytics-events.constants';
//import { AnalyticsFirebaseService } from 'src/app/services/analytics-firebase.service';
import { appData, environment } from '../../../environments/environment';
// import { callbackConstants, callbackEvents } from 'src/app/constants/lib-callback.constants';
import { MyLibService as OnemoneyWebsdkService } from '../../../lib/my-lib.service';


declare var createComponent: any, triggerCallback;

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: any;
  isVerifyNumber: boolean = false;
  signupData: any;
  isFromSdk: boolean;
  aahandle: any;
  userNumber: any;
  constructor(
    private formDefinationService: FormDefinationService,
    private httpService: HttpService,
    private commonService: CommonService, private oneMoneyService: OnemoneyWebsdkService,
    private loader: LoaderService,
    private router: Router
  ) {

    for (var inputModel of this.formDefinationService.signupFormInputsConfig) {
      if (inputModel.key == "userName") {
        inputModel.value = commonService.redirectInstanceData.customername;
      }
      else if (inputModel.key == "VUA") {
        inputModel.value = localStorage.getItem("mobileNumber");
      } else if (inputModel.key == "mobileNumber") {
        inputModel.value = localStorage.getItem("mobileNumber");
      }
    }
    this.signupForm = this.formDefinationService.initForm(this.formDefinationService.formTypes.SIGNUP);
  }

  ngOnInit() {
    //this.analyticsService.firePageView(pageViewList.REGISTER);
    this.userNumber = localStorage.getItem("mobileNumber");
    this.isFromSdk = JSON.parse(localStorage.getItem("isFromSdk"));
  }
  /**
   * @desc To signup user
   * @param  {object} form
   */
  vuaExtension = "@onemoney";
  vuaData: any;
  otp_reference: any;
  userDetail: any;
  signUpUser(event) {
    let form = event.formData;
    localStorage.setItem("consentHandle", "");
    this.vuaData = form.controls.VUA.value + this.vuaExtension;
    // console.log(form);
    let data = {
      name: form.controls.userName.value,
      phone_number: form.controls.mobileNumber.value,
      terms_and_conditions: form.controls.acceptTerms.value,
      vua: this.vuaData

    };
    localStorage.setItem('userDetails', JSON.stringify(data));
    let options = {
      url: "signup",
      type: "post",
      isDeveloper: true,
      body: data
    };
    this.oneMoneyService.userRegistration(appData.organisationid, appData.client_id, appData.client_secret,
      [{ appIdentifier: appData.appIdentifier }], data).subscribe(
        (response => {
          if(response.status==true){
          this.userDetail = response;
          this.loader.showToast(toastStatuses.SUCCESS, 'otpSentSuccessfully');
          let signupData = {
            name: form.controls.userName.value,
            phone_number: form.controls.mobileNumber.value,
            terms_and_conditions: form.controls.acceptTerms.value,
            otp_reference: this.userDetail.otp_reference,
            vua: this.vuaData,
            url: "signup"
          };
          this.isVerifyNumber = true;
          this.signupData = signupData;
          
        }
        else{
          this.loader.showToast(toastStatuses.ERROR, 'theMobileNumberAlreadyExistsPleaseUse');
        }}));

  }

  /**
   * navigate the user to login
   */
  gotoLogin() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (environment.library) {
      createComponent("login");
    } else {
      this.router.navigate(["/login"]);
    }
  }

  ngOnDestroy() {
    this.signupForm.formGroup.reset();
  }

  closeLoader() {
    this.loader.toggleLoader(false);
    this.loader.setwebSdkShowMessage("");
  }
}
