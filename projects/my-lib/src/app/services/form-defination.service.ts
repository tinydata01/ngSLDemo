import { Injectable } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";



@Injectable({
  providedIn: "root"
})
export class FormDefinationService {
  MOBILE = 'validateMobile';
  ACCNO = '';
  CRNNO = ''

  formTypes = {
    LOGIN: {
      type: "loginForm",
      config: "loginFormInputsConfig"
    },
    SIGNUP: {
      type: "signupForm",
      config: "signupFormInputsConfig"
    },
    CHANGE_PIN: {
      type: "changePinForm",
      config: "changePinFormInputsConfig"
    },
    FORGOT_PIN: {
      type: "forgotPinForm",
      config: "forgotPinFormInputsConfig"
    }
  }

  loginFormInputsConfig = [
    {
      type: "text",
      placeholder: "loginUsingMobileNumber",
      label: "Mobile Number",
      labelImage: "mobile",
      required: true,
      key: "vua",
      value: "",
      controlType: "inputText",
      editable: true,
      emptyValueMessage: "pleaseEnterValidMobileNumber",
      validationValue: "pleaseEnterValidMobileNumber",
      validators: [Validators.required, FormDefinationService.validateMobile],
      digitOnly: 10,
      updateOn: 'blur',
      focus: true,
      maxLength: 10
    },
    {
      type: "checkbox",
      placeholder: "",
      label: "HDFCPrivacyPolicy",
      required: true,
      key: "acceptHDFCTerms",
      value: "",
      controlType: "checkbox",
      emptyValueMessage: "pleaseSelectTermsAndConditions",
      leftLable: true,
      validators: [Validators.requiredTrue]
    },
    // {
    //   type: "password",
    //   placeholder: "Enter 6-digit PIN",
    //   label: "Password",
    //   labelImage: "lock",
    //   required: true,
    //   key: "password",
    //   value: "",
    //   editable : true,
    //   imagePassword: "eye-closed",
    //   emptyValueMessage:"Please enter login PIN",
    //   validationValue:"Please enter valid PIN",
    //   controlType: "inputTextPassword",
    //   validators: [Validators.required,FormDefinationService.validateConsentPin]
    // },
    // {
    //   type: "otp",
    //   placeholder: "enterSixDigitPIN",
    //   label: "PIN",
    //   labelImage: "lock",
    //   required: true,
    //   key: "otp",
    //   value: "",
    //   editable: true,
    //   emptyValueMessage: "pleaseEnterLoginPIN",
    //   validationValue: "pleaseEnterValidPIN",
    //   controlType: "otp",
    //   validators: [Validators.required, FormDefinationService.validateLoginPin],
    //   category: 'password',
    //   imagePassword: 'eye-closed',
    //   forgotPin: true
    // },
   
    {
      type: "submit",
      placeholder: "",
      label: "Continue",
      required: true,
      key: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: ""
    }
  ];

  signupFormInputsConfig = [
    {
      type: "text",
      placeholder: "pleaseEnterYourFullName",
      label: "Name",
      required: true,
      key: "userName",
      labelImage: "user",
      value: "",
      controlType: "inputText",
      editable: true,
      emptyValueMessage: "pleaseEnterYourName",
      validationValue: "pleaseEnterValidName",
      validators: [Validators.required],
      focus: true
    },
    {
      type: "number",
      placeholder: "enterYourMobileNumber",
      label: "Mobile Number",
      labelImage: "mobile",
      required: true,
      key: "mobileNumber",
      value:  localStorage.getItem("mobileNumber"),
      editable: false,
      controlType: "inputText",
      emptyValueMessage: "pleaseEnterMobileNumber",
      validationValue: "pleaseEnterValidMobileNumber",
      validators: [Validators.required, FormDefinationService.validateMobile],
      updateOn: 'blur',
      digitOnly: 10
    },
    {
      type: "text",
      placeholder: "enterVUA",
      label: "VUA",
      labelImage: "",
      required: true,
      key: "VUA",
      imagePassword: "eye-closed",
      value: localStorage.getItem("mobileNumber"),
      editable : false,
      controlType: "inputVuaText",
      emptyValueMessage:"pleaseEnterVUA",
      validationValue:"pleaseEnterVUA",
      validators: [
        Validators.required
      ]
    },
    // {
    //   type: "password",
    //   placeholder: "Set your 6-digit PIN",
    //   label: "Consent Pin",
    //   labelImage: "lock",
    //   required: true,
    //   key: "consentPin",
    //   imagePassword: "eye-closed",
    //   value: "",
    //   editable : true,
    //   controlType: "inputTextPassword",
    //   emptyValueMessage:"Please enter login PIN",
    //   validationValue:"Please enter 6 digit number",
    //   validators: [
    //     Validators.required,
    //     FormDefinationService.validateConsentPin
    //   ]
    // },
    // {
    //   type: "otp",
    //   placeholder: "enterSixDigitPIN",
    //   label: "PIN",
    //   labelImage: "lock",
    //   required: true,
    //   key: "otp",
    //   value: "",
    //   editable: true,
    //   emptyValueMessage: "pleaseEnterLoginPIN",
    //   validationValue: "pleaseEnterValidPIN",
    //   controlType: "otp",
    //   validators: [Validators.required, FormDefinationService.validateLoginPin],
    //   category: 'password',
    //   imagePassword: 'eye-closed',
    //   id:"signupFormOtp"
    // },
    {
      type: "checkbox",
      placeholder: "",
      label: "iAgreeToOnemoneyTermsAndConditions",
      required: true,
      key: "acceptTerms",
      value: "",
      controlType: "checkbox",
      emptyValueMessage: "pleaseSelectTermsAndConditions",
      leftLable: true,
      validators: [Validators.requiredTrue]
  
    },
    {
      type: "submit",
      placeholder: "",
      label: "Register",
      required: true,
      key: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: "",
      id:"signupFormBtn"
    }
  ];

  vuaCreationInputsConfig = [
    {
      type: "text",
      placeholder: "VUA",
      label: "vua",
      labelImage: "onemoneyid",
      required: true,
      key: "vua",
      value: "",
      controlType: "inputVuaText",           
      editable: true,
      emptyValueMessage: "minimumLength",
      validationValue: "pleaseEnterValidValue",
      maxLength: 25,
      validators: [Validators.required, FormDefinationService.validateVua]
      //   helpText : "You can enter custom ID"
    },
    {
      type: "submit",
      placeholder: "",
      label: "Next",
      required: true,
      key: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: ""
    }
  ]

  changePinFormInputsConfig = [
    // {
    //   type: "text",
    //   placeholder: "Old PIN",
    //   label: "Enter Your Old PIN",
    //   labelImage: "",
    //   required: true,
    //   key: "oldPin",
    //   value: "",
    //   controlType: "inputTextWithLeftLabel",
    //   editable: true,
    //   emptyValueMessage:"Please enter Old PIN",
    //   validationValue:"Please enter valid 6 digit number",
    //   isInnerFormPassword:false,
    //   validators: [Validators.required, FormDefinationService.validateConsentPin]
    // },
    // {
    //   type: "password",
    //   placeholder: "New PIN",
    //   label: "Enter Your New PIN",
    //   labelImage: "",
    //   required: true,
    //   key: "newPin",
    //   value: "",
    //   editable : true,
    //   imagePassword: "eye-closed",
    //   emptyValueMessage:"Please enter New PIN",
    //   validationValue:"Please enter 6 digit number",
    //   isInnerFormPassword:true,
    //   controlType: "inputTextWithLeftLabel",
    //   validators: [Validators.required,FormDefinationService.validateConsentPin]
    // },
    {
      type: "otp",
      placeholder: "OldPIN",
      label: "enterYourOldPIN",
      labelImage: "",
      required: true,
      key: "oldPin",
      value: "",
      editable: true,
      emptyValueMessage: "pleaseEnterOldPIN",
      validationValue: "pleaseEnterValid6DigitNumber",
      controlType: "otp",
      validators: [Validators.required, FormDefinationService.validateLoginPin],
      category: 'password',
      imagePassword: 'eye-closed',
      showLabel: true
    }, {
      type: "otp",
      placeholder: "newPIN",
      label: "enterYourNewPIN",
      labelImage: "",
      required: true,
      key: "newPin",
      value: "",
      editable: true,
      emptyValueMessage: "pleaseEnterNewPIN",
      validationValue: "pleaseEnterValid6DigitNumber",
      controlType: "otp",
      validators: [Validators.required, FormDefinationService.validateLoginPin],
      category: 'password',
      imagePassword: 'eye-closed',
      showLabel: true
    },
    {
      type: "submit",
      placeholder: "",
      label: "Save",
      required: true,
      key: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: ""
    }
  ];
  forgotPinFormInputsConfig = [
    {
      type: "number",
      placeholder: "mobileNumber",
      label: "mobileNumber",
      labelImage: "mobile",
      required: true,
      key: "mobileNumber",
      value: "",
      editable: true,
      controlType: "inputText",
      emptyValueMessage: "pleaseEnterValidMobileNumber",
      validationValue: "pleaseEnterValidMobileNumber",
      validators: [Validators.required, FormDefinationService.validateMobile],
      digitOnly: 10,
      maxLength: 10
    },
    {
      type: "submit",
      placeholder: "",
      label: "getOTP",
      required: true,
      key: "",
      value: "",
      controlType: "submitButton",
      validators: [],
      callback: ""
    }
  ]

  signupForm = {
    formGroup: null,
    formInputs: this.signupFormInputsConfig
  };
  loginForm = {
    formGroup: null,
    formInputs: this.loginFormInputsConfig
  };
  vuaCreationForm = {
    formGroup: null,
    formInputs: this.vuaCreationInputsConfig
  }
  changePinForm = {
    formGroup: null,
    formInputs: this.changePinFormInputsConfig
  }
  forgotPinForm = {
    formGroup: null,
    formInputs: this.forgotPinFormInputsConfig
  }
  constructor(private formBuilder: FormBuilder) {
    //signUp form
    this.signupForm.formGroup = this.toReactiveForm(
      this.signupFormInputsConfig
    );
    this.signupForm.formInputs = this.signupFormInputsConfig;

    //VUA creation 
    this.vuaCreationForm.formGroup = this.toReactiveForm(
      this.vuaCreationInputsConfig
    );
    this.vuaCreationForm.formInputs = this.vuaCreationInputsConfig;

    //Login creation

    this.loginForm.formGroup = this.toReactiveForm(
      this.loginFormInputsConfig
    );
    this.loginForm.formInputs = this.loginFormInputsConfig

  }

  initForm(formType) {
    //LoginForm
    this[formType.type].formGroup = this.toReactiveForm(this[formType.config]);
    this[formType.type].formInputs = this[formType.config];
    return this[formType.type];
  }


  /**
   * this function is used to extract form group from given array of inputs
   * @param inputs {Array} - array of input fields
   */
  toReactiveForm(inputs: Array<{}>) {
    let group = {};
    inputs.forEach(input => {
      if (input["controlType"] === "formGroup") {
        group[input["key"]] = this.toReactiveForm(input["formInputs"]);
      } else if (input["controlType"] === "formArray") {
        let formArray = this.formBuilder.array([]);
        input["formInputs"].forEach(formGroup => {
          let fGroup = this.toReactiveForm(formGroup["formInputs"]);
          formArray.push(fGroup);
        });
        group[input["key"]] = formArray;
      } else if (input["controlType"] === "submitButton") {
        //Don't add to form Group
      } else {
        group[input["key"]] = [input["value"] || "", input["validators"]];
      }
    });
    return this.formBuilder.group(group);
  }

  /**
   * @desc To validate mobile number
   * @param  control
   * @returns null or object
   */
  static validateMobile(control: FormControl): any {
    var regex = /^[6-9]{1}[0-9]{9}$/;
    var found = regex.test(control.value);
    return control.value === "1999999999" || found ? null : { mobile: true };
  }

  static validateConsentPin(control: FormControl): any {
    var regex = /^[0-9]{6}$/;
    var found = regex.test(control.value);
    return found ? null : { consentPin: true };
  }

  static validateLoginPin(control: FormControl): any {
    var regex = /^[0-9]{6}$/;
    var found = regex.test(control.value);
    return found ? null : { otp: true };
  }


  static validateCRN(number): any {
    var regex = /^[0-9A-Za-z]{6,}$/;
    var found = regex.test(number);
    return found ? true : false;
  }

  static validateName(control: FormControl): any {
    var regex = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
    // var regex = /^[A-Za-z]{1,}$/;
    var multipleSpaces = false;
    var found = regex.test(control.value);
    if (found && control.value) {
      for (let i = 0; i < control.value.length; i++) {
        if (control.value[i] == ' ' && control.value[i + 1] == ' ') {
          multipleSpaces = true;
        }
      }
    }
    return (found && !multipleSpaces) ? null : { name: true };
  }

  static validatePan(control: FormControl): any {
    var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    var found = regex.test(control.value);
    return found ? null : { pan: true };
  }

  static validateUniqueUsername(control: FormControl): any {
    var regex = /^[a-zA-Z][a-zA-Z0-9._-]{7,14}$/;
    var found = regex.test(control.value);
    return found ? null : { username: true};
  }
  /**
   * @chaithu
   * Adding Vua validation that allowing only 
   * Alphanumerics with -_.
   */
  static validateVua(control: FormControl): any {
     var regex = /^([A-Za-z0-9][a-zA-Z0-9-_.]{2,24})*$/
    var found = regex.test(control.value);
    var multispaces = false;
     if (found && control.value) {
       for(let i = 0; i < control.value.length; i++){
         if(control.value[i] == ' ' && control.value[i + 1] == ' '){
          multispaces = true;
         }
       }
      }
    return (found && !multispaces) ? null : { vua: true };
    //return found ? null : { vua: true };
  }
}
