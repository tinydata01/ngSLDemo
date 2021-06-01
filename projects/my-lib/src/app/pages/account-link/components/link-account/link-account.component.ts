import { Component, OnInit, Input } from '@angular/core';
import { FormDefinationService } from '../../../../services/form-defination.service';
import { HttpService } from '../../../../services/http.service';
import { formStatuses } from '../../../../constants/account-linking.constant';
import { LoaderService } from '../../../../services/loader.service';
import { toastStatuses } from '../../../../components/toast/toast.component';
import { LinkingStepperHelperService } from '../../services/linking-stepper-helper.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';

declare var webSDKCustomCss;
@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.scss']
})
export class LinkAccountComponent implements OnInit {

  constructor(
    private formDefinationService: FormDefinationService,
    private httpService: HttpService,
    private commonService: CommonService,
    private loader: LoaderService,
    private stepperService: LinkingStepperHelperService
  ) { }

  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30
  };
  userNumber: any;
  enteredOtp: any = '';
  discoverdAccounts: any;
  eachfi: any;
  formStatuses = formStatuses;
  submitted = false;
  showConsentActionPopup: boolean;
  accActionDetails: any;
  opened:boolean = true;
  timer:any;

  @Input() set discoveredAccs(value: any) {
    if (value && Object.keys(value).length) {
      this.eachfi = value;
      this.massageDiscoverData(this.eachfi);
    }
  }

  ngOnInit() { 
  clearTimeout(this.timer)
  this.timer = setTimeout(()=>{
    this.opened = false;
  }, 60000);}

  /**
   * stucturing FIs data for discovery flow
   * @param FIsData
   */
  massageDiscoverData(FIsData) {
    if (FIsData) {
      this.buildFormdData(FIsData);
    }
  }

  /**
   * submit the link account form
   * @param fi
   */
  linkAccountFormSubmit(fi, resend = false) {
    //call api
    // fi.userNumber = JSON.parse(localStorage.getItem("userDetails"))
    //   ? JSON.parse(localStorage.getItem("userDetails")).userData.mobile
    //   : "";
    this.submitted = false;
    let anyLinkAccount;
    for (let [key, value] of Object.entries(fi.formdata.value)) {
      fi.discoveredAccounts.forEach(discoveredAccount => {
        if (value == true && discoveredAccount.accRefNumber == key) {
          anyLinkAccount = true;
          discoveredAccount["linkRequested"] = true;
        }
      });
    }
    if (anyLinkAccount) {
      this.changeFormStaus(formStatuses.PENDING, fi);
      fi.linkAccountForm.formInputs.forEach(field => {
        field.editable = false;
      });
      if (fi.formStatus != formStatuses.SEND_OTP && !resend) {
        fi.linkAccountForm.formInputs.pop();
      }
      let data = {
        discoveredAccounts: this.returnSelectedAccounts(fi.linkAccountForm.formGroup.value, fi.discoveredAccounts),
        // discoveredAccounts: fi.discoveredAccounts,
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
      this.httpService.makeHttpRequestWOLoader(options).subscribe(res => {
        if (res && res.data) {
          if (res.data.AuthenticatorType == "TOKEN") {
            fi["otpRefnumber"] = res.data.RefNumber;
            if (resend) {
              this.reEnterOtpField();
              this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully')
            }
            this.changeFormStaus(formStatuses.SEND_OTP, fi);
            this.showConsentActionPopup = true;
            this.accActionDetails = {
              eachFi: fi,
              type: "link",
              popupText: 'linkAccounts',
              confirmNeed: false,
              confirmed: false,
              okBtn: 'confirm',
              cancelBtn: 'cancel',
              action: 'accountLinking',
            }
          } else {
            this.changeFormStaus(formStatuses.PENDING, fi);
          }
        } else {
          this.changeFormStaus(formStatuses.FAILED, fi);
        }
      });
    }
  }

  /**
   * to send otp for sbi account verfification
   * @param selectedFi
   */
  sendOtp(selectedFi) {
    //send otp
    this.submitted = true;
    if (this.enteredOtp && this.enteredOtp.length == this.settings.length) {
      let data = {
        otp: this.enteredOtp,
        RefNumber: selectedFi.otpRefnumber,
        fipID: selectedFi.fipID
      };
      let options = {
        url: "accountOtp",
        type: "post",
        isDeveloper: true,
        includeUserSession: true,
        body: data
      };
      this.changeFormStaus(formStatuses.PENDING, selectedFi);
      this.httpService.makeHttpRequestWOLoader(options).subscribe(res => {
        if(environment.library) { webSDKCustomCss(); }
        if (res && res.status == true) {
          this.commonService.updateUserAccounts();
          this.changeFormStaus(formStatuses.DONE, selectedFi);
          this.stepperService.markCurrentStepAsDone();
        } else {
          this.submitted = false;
          this.loader.showToast(toastStatuses.ERROR, this.commonService.getErrorStringFor(res.errorCode, options.url));
          if(res.errorCode == "INVALID_OTP") {
            this.reEnterOtpField();
            this.changeFormStaus(formStatuses.SEND_OTP, selectedFi);
          } else {
            this.changeFormStaus(formStatuses.FAILED, selectedFi);
          }
        }
      });
    }
  }

  skipFi(fi) {
    this.changeFormStaus(formStatuses.SKIPPED, fi);
  }

  returnSelectedAccounts(formValue, discoveredAccounts) {
    let selectedAccounts = [];
    discoveredAccounts.forEach(account => {
      if (this.hasKeySetTo(formValue, account.accRefNumber, true)) {
        selectedAccounts.push(account);
      }
    })
    return selectedAccounts;
  }

  returnSelectedGSTAccounts(formValue, discoveredAccounts) {
    console.log("formValue", formValue)
    let selectedAccounts = [];
    discoveredAccounts.forEach(account => {
      if (this.hasKeySetTo(formValue, account.accRefNumber, true)) {
        account['userName'] = formValue.userName
        //account['userName'] = fi.gstlinkAccountForm[selectedFormGroup].formGroup.value.userName,
        selectedAccounts.push(account);
      }
    })
    return selectedAccounts;
  }

  hasKeySetTo(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] == value;
  }

  /**
   * to cancel otp for abi account verification
   * @param selectedFi
   */
  cancelOtp(selectedFi) {
    clearTimeout(this.timer)
    this.submitted = false
    this.buildFormdData(selectedFi);
  }

  /**
   * build formdata for each fi
   * @param eachFi
   */
  buildFormdData(eachFi) {
    let linkAccountFormConfig = [];
    let gstinAccountFormConfig = [];
    let gstinAccountFormConfigGroup = [];
    // console.log(eachFi);
    let unlinked = eachFi.discoveredAccounts.filter((acc) => !acc.linked);
    unlinked.forEach(account => {
      let formInputConfig = {
        type: "checkbox",
        placeholder: "Name",
        label: this.getLabel(account),
        required: true,
        key: account.accRefNumber,
        id: account.maskedAccNumber,
        labelImage: "",
        value: "",
        controlType: "checkbox",
        editable: true,
        validators: []
      };
      // TODO: Make auto selected & editable false for already linked accounts
      if(account.accType != "GST") {
        linkAccountFormConfig.push(formInputConfig);
      }
    });
    let buttonLabel = "link";
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

    let gstinAccounts = unlinked.filter(account => {
      return account.accType == "GST";
    })

    gstinAccounts.forEach(account => {
        let formInputConfig = {
          type: "checkbox",
          placeholder: "Name",
          label: this.getLabel(account),
          required: true,
          key: account.accRefNumber,
          id: account.maskedAccNumber,
          labelImage: "",
          value: true,
          controlType: "checkbox",
          editable: true,
          validators: []
        };
      
        gstinAccountFormConfig.push(formInputConfig);

        gstinAccountFormConfig.push({
          type: "text",
          placeholder: "",
          label: "Unique Username",
          required: true,
          editable: true,
          key: "userName",
          id: "",
          value: "",
          controlType: "inputTextWithLeftLabel",
          emptyValueMessage: "pleaseEnterValue",
          validators: [Validators.required, FormDefinationService.validateUniqueUsername],
          callback: ""
        });

        gstinAccountFormConfig.push({
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

        let gstlinkAccountForm = {
          formGroup: null,
          formInputs: gstinAccountFormConfig
        };
        gstlinkAccountForm.formGroup = this.formDefinationService.toReactiveForm(
          gstinAccountFormConfig
        );
        gstinAccountFormConfigGroup.push(gstlinkAccountForm)
        gstinAccountFormConfig = [];

    });
    
    eachFi["gstlinkAccountForm"] = gstinAccountFormConfigGroup;
    

    linkAccountForm.formInputs = linkAccountFormConfig;
    eachFi["linkAccountForm"] = linkAccountForm;
    
    this.changeFormStaus(formStatuses.NOT_VERIFIED, eachFi);
  }

  gstLinkAccountFormSubmit(event, resend = false) {
    this.submitted = false;
    let anyLinkAccount;
    let selectedFormGroup = event.index;
    let fi = event.fi;
    
    for (let [key, value] of Object.entries(fi.formdata.value)) {
      fi.discoveredAccounts.forEach(discoveredAccount => {
        // console.log("discoveraccounts",discoveredAccount, fi.gstlinkAccountForm[selectedFormGroup].formGroup.value.userName)
        if (value == true && discoveredAccount.accRefNumber == key) {
          anyLinkAccount = true;
          discoveredAccount["linkRequested"] = true;
          //fi.gstlinkAccountForm[selectedFormGroup].formGroup.value.userName;
          // this.discoverdAccounts['userName'].value;
        }
      });
    }

    if (anyLinkAccount) {
      this.changeFormStaus(formStatuses.PENDING, fi);
      fi.gstlinkAccountForm.forEach((gst, index) => {
          gst.formInputs.forEach(field => {
            field.editable = false;
          })
      });
      if (fi.formStatus != formStatuses.SEND_OTP && !resend) {
        fi.gstlinkAccountForm.forEach(gst => { 
          gst.formInputs.pop();
        })
      }
      
      let data = {
        discoveredAccounts: this.returnSelectedGSTAccounts(fi.gstlinkAccountForm[selectedFormGroup].formGroup.value, fi.discoveredAccounts,                                
          ),
        // userName: fi.gstlinkAccountForm[selectedFormGroup].formGroup.value.userName,
        fip: {
          FIPName: fi.fipName,
          FIPID: fi.fipID
        }
      };
      console.log("data in GST", data)
      let options = {
        url: "accountlink",
        type: "post",
        isDeveloper: true,
        includeUserSession: true,
        body: data
      };
      console.log("options", options)
      this.httpService.makeHttpRequestWOLoader(options).subscribe(res => {
        if (res && res.data) {
          if (res.data.AuthenticatorType == "TOKEN") {
            fi["otpRefnumber"] = res.data.RefNumber;
            if (resend) {
              this.reEnterOtpField();
              this.loader.showToast(toastStatuses.SUCCESS, 'otpResentSuccessfully')
            }
            this.changeFormStaus(formStatuses.SEND_OTP, fi);
          } else {
            this.changeFormStaus(formStatuses.PENDING, fi);
          }
        } else {
          this.changeFormStaus(formStatuses.FAILED, fi);
        }
      });
    }
  }

  hideConcentActionPopup(event) {
    this.showConsentActionPopup = false;
    this.cancelOtp(event.fi);
  }

  submitOtp(event) {
    if(event) {
      this.enteredOtp = event.enteredOtp;
      this.sendOtp(event.fi);
    }
  }

  resendOtp(event) {
    if(event) { 
      this.linkAccountFormSubmit(event.fi, event.status);
    }
  }

  /**
   * get label name by account
   * @param account 
   */
  getLabel(account) {
    if (account.accType == "DEFAULT") {
      return account.FIType
    }
    else {
      return account.accType
    }
  }

  /**
   * changing status of form
   * @param status
   */
  changeFormStaus(status, fiData) {
    if(environment.library) { webSDKCustomCss(); }
    fiData.formStatus = status;
  }

  /**
   *
   * @param e
   */
  onInputChange(e) {
    this.enteredOtp = ''
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

  reEnterOtpField() {
    this.enteredOtp = '';
    this.submitted = false;
  }
  keyDownFunction(event, selectedFi){
    if(event.key == "Enter"){
      this.sendOtp(selectedFi)
    }
  }

}
