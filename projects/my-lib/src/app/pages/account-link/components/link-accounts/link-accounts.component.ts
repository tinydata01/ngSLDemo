import { Component, OnInit } from "@angular/core";

import { FormDefinationService } from "../../../../services/form-defination.service";
import { HttpService } from "../../../../services/http.service";
import { utilService } from "../../../../services/util.service";
import { LinkingStepperHelperService } from "../../services/linking-stepper-helper.service";
import { eventsList } from '../../../../constants/analytics-events.constants';
// import { AnalyticsFirebaseService } from 'src/app/services/analytics-firebase.service';

@Component({
  selector: "app-link-accounts",
  templateUrl: "./link-accounts.component.html",
  styleUrls: ["./link-accounts.component.scss"]
})
export class LinkAccountsComponent implements OnInit {
  constructor(
    private formDefinationService: FormDefinationService,
    private httpService: HttpService,
     private linkingStepperService: LinkingStepperHelperService
  ) { }

  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30
  };
  userNumber: any;
  enteredOtp: any;
  discoverdAccounts: any;

  ngOnInit() {
    this.discoverdAccounts = this.linkingStepperService.getData(
      "discoveredAccounts"
    );
    // console.log(this.discoverdAccounts);
    this.massageDiscoverData(this.discoverdAccounts);
  }

  /**
   * stucturing FIs data for discovery flow
   *
   * @param FIsData
   */
  massageDiscoverData(FIsData) {
    FIsData.forEach(eachFi => {
      this.buildFormdData(eachFi);
    });
  }

  /**
   * submit the link account form
   * @param fi
   */
  linkAccountFormSubmit(fi) {
    //call api

    fi.userNumber = JSON.parse(localStorage.getItem("userDetails"))
      ? JSON.parse(localStorage.getItem("userDetails")).userData.mobile
      : "";
    let fipsdata = [];
    let anyLinkAccount;
    for (let [key, value] of Object.entries(fi.formdata.value)) {
      fi.discoveredAccounts.forEach(discoveredAccount => {
        if (value == true && discoveredAccount.acc == key) {
          anyLinkAccount = true;
          discoveredAccount["linkRequested"] = true;
        }
      });
    }
    if (anyLinkAccount) {
      fi.linkAccountForm.formInputs.forEach(field => {
        field.editable = false;
      });
      if (fi.formStatus != "sendotp") {
        fi.linkAccountForm.formInputs.pop();
      }
      let data = {
        discoveredAccounts: fi.discoveredAccounts,
        fip: {
          FIPName: fi.fipName,
          FIPID: fi.fipID
        }
      };

      let options = {
        url: "accountlink",
        type: "post",
        isDeveloper: true,
        includeUserSession: true,
        body: data
      };
      this.httpService.makeHttpRequest(options).subscribe(res => {
        if (res && res.data) {
          if (res.data.AuthenticatorType == "TOKEN") {
            fi["otpRefnumber"] = res.data.RefNumber;
            this.changeFormStaus("sendotp", fi);
          } else {
            this.changeFormStaus("pending", fi);
          }
        } else {
          this.changeFormStaus("failed", fi);
        }
      });
    }
  }

  skipFi(fi) {
    this.changeFormStaus("skipped", fi);
  }

  /**
   * changing status of form
   * @param status
   */
  changeFormStaus(status, fiData) {
    fiData.formStatus = status;
  }

  /**
   *
   * @param e
   */
  onInputChange(e) {
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      this.enteredOtp = e;
    }
  }

  /**
   * to send otp for sbi account verfification
   * @param selectedFi
   */


  /**
   * to cancel otp for abi account verification
   * @param selectedFi
   */
  cancelOtp(selectedFi) {
    this.buildFormdData(selectedFi);
  }

  /**
   * build formdata for each fi
   * @param eachFi
   */
  buildFormdData(eachFi) {
    let linkAccountFormConfig = [];
    // console.log(eachFi);
    eachFi.discoveredAccounts.forEach(account => {
      let formInputConfig = {
        type: "checkbox",
        placeholder: "Name",
        label: account.accType,
        required: true,
        key: account.accRefNumber,
        id: account.maskedAccNumber,
        labelImage: "",
        value: "",
        controlType: "checkbox",
        editable: true,
        validators: []
      };
      linkAccountFormConfig.push(formInputConfig);
    });
    let buttonLabel = "Link";
    linkAccountFormConfig.push({
      type: "button",
      placeholder: "",
      label: buttonLabel,
      required: true,
      editable: true,
      key: "",
      id: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: ""
    });
    let linkAccountForm = {
      formGroup: null,
      formInputs: linkAccountFormConfig
    };
    linkAccountForm.formGroup = this.formDefinationService.toReactiveForm(
      linkAccountFormConfig
    );
    linkAccountForm.formInputs = linkAccountFormConfig;
    eachFi["linkAccountForm"] = linkAccountForm;
    eachFi["formStatus"] = "notVerified";
  }
}
