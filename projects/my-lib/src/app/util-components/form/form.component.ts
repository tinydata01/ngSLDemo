import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { routePaths } from '../../constants/routing.constant';
import * as config from '../../../assets/config.json';
import { UserService } from "src/app/services/user.service";
declare var webSDKCustomCss;

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  production:boolean = false
  @Input() formGroup;
  @Input() formInputs;
  @Input() fi;
  @Input() set linkedAccounts(value: any) {
    if (value) {
      this.highlightLinkedAccounts = true;
    } else {
      this.highlightLinkedAccounts = false;
    }
  }
  @Input() isDiscovery: boolean = false;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter();
  @Output() cancelFormEvent: EventEmitter<any> = new EventEmitter();
  bankName:string;
  highlightLinkedAccounts;
  detectChangesForLib: any;
  formSubmitAttempt: boolean = false;
  hideForgotPin: boolean = false;
  userNumber: any;
  aahandle:any;
  constructor(private router: Router, private ref: ChangeDetectorRef) { 
    this.bankName= UserService.data["bankName"];
   }

  ngOnInit() {
    this.setCallBackFunctions(this.formInputs);
 
    // To detect changes in custom web element which is used as library
    if (this.production) {
      this.hideForgotPin = true;
      webSDKCustomCss();
      setInterval(() => {
        this.detectChangesForLib = this.ref.detectChanges();
      }, 500);
    }
  }

  setCallBackFunctions(formInputs) {
    formInputs.forEach(input => {
      input.callback = "";
      if (input.controlType === "submitButton") {
        input.callback = this.submit.bind(this);
      } else if (input.controlType === "cancelButton") {
        input.callback = this.cancel.bind(this);
      }
    });
  }
  /**
   * On form field changes
   */
  ngOnChanges() {
    this.setCallBackFunctions(this.formInputs)
  }

  cancel(event): void {
    this.formGroup.reset();
    this.cancelFormEvent.emit({ e: event });
  }

  /**
   * @desc This function will submit the form after checking for all the validations
   */
  submit(event): void {
    this.formSubmitAttempt = true;
    if (this.formGroup.valid) {
      if (this.isDiscovery) {
        this.fi['formdata'] = this.formGroup
        this.submitEvent.emit(this.fi);
      } else {
        this.submitEvent.emit({ e: event, formData: this.formGroup });
      }
      this.formSubmitAttempt = false;
    }
  }

  /**
   * this function is used to check error for a given input control
   * @param control {FormControl} - form control to be validated
   * @param formSubmitted {boolean} - to validate the form on form submission
   */
  isInvalid(control, formSubmitted) {
    return (
      (control.invalid && formSubmitted && (control.touched || control.dirty)) ||
      (formSubmitted && control.invalid)
    );
  }

  /**
   *
   * @param passwordField
   */
  togglePassword(fieldPassword) {
    if (fieldPassword.type == "password") {
      fieldPassword.type = "text";
      fieldPassword.imagePassword = "eye-opened";
    } else {
      fieldPassword.type = "password";
      fieldPassword.imagePassword = "eye-closed";
    }
  }

  toggleEye(fieldPassword) {
    if (fieldPassword.category == 'password') {
      fieldPassword.category = 'text'
      fieldPassword.imagePassword = "eye-opened";
    } else {
      fieldPassword.category = "password";
      fieldPassword.imagePassword = "eye-closed";

    }
  }

  gotoForgotPin() {
    if (!this.production) {
      this.router.navigate([routePaths.AUTH, routePaths.FORGOT_PIN])
    }
  }

  trimStartAndTerminatingSpaces(event, label) {
    if (label == 'Name') {
      event.srcElement.value = event.srcElement.value.trim();
    }
  }

  ngOnDestroy() {
    this.formInputs.forEach(input => {
      if (input.type == 'otp' && input.imagePassword) {
        input.category = "password";
        input.imagePassword = "eye-closed"
      }
    })
    if (this.production && this.detectChangesForLib) {
      clearInterval(this.detectChangesForLib);
    }
  }

  navigateTo(link) {
    window.open(link, '_blank');
  }
}

