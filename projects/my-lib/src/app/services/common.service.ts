/**
 * All common service functions will go here
 * Remove/add functions on the basis of requirement
 * Added functionality for pdf file open in new browser tab, remove if not needed
 * Disable/Enable body scroll on loader show/hide. Remove if not required
 */
 import { Injectable } from '@angular/core';
 import { Subject, BehaviorSubject } from 'rxjs';
 import { HttpService } from './http.service';
 import { DynamicItem } from '../models/dynamicitem';
 import { MessagesComponent } from '../components/popups/messages/messages.component';
 import { FormDefinationService } from '../services/form-defination.service';
 
 //import { TranslateService } from '@ngx-translate/core'
 import { UserService } from './user.service';
 import { LoaderService } from './loader.service';
import { TranslateService } from '@ngx-translate/core';
 @Injectable({
     providedIn: 'root'
 })
 export class CommonService {
    
     constructor(
         private httpService: HttpService,
         private formDefinationService: FormDefinationService,
         public translate: TranslateService,
         private userService: UserService,
         private loader: LoaderService,
     ) { }
 
     isConsentEditStatus: boolean = false;
     vuaExtension = "@onemoney";
     phoneExtension = "+91";
     consentPinLength = 6;
     fipList;
     fiuList;
     currentUrl: any = '/dashboard';
     userDetails = {
         userName: '',
         userNumber: ''
     }
 
     isRedirectInstance: boolean = false;
     redirectInstanceData = {
         redirect: '',
         consenthandle: '',
         txnid: '',
         sessionid: '',
         srcref: '',
         customername: '',
         mobile: ''
     }
 
     readonly RedirectStatus = Object.freeze({ "SUCCESS": "S", "ERROR": "F" });
     readonly RedirectErrorCode = Object.freeze({ "NO_ERROR": 0, "CONSENT_REJECTED": 1, "CONSENT_NOT_FOUND": 2, "USER_ALREADY_REGISTERED": 1, "INVALID_NAME_OR_MOBILE_NUMBER": 2, "MISSING_PARAMS": 3, "CONSENT_PAUSED": 4, "CONSENT_RESUMED": 5, "CONSENT_REVOKED": 6 });
 
     languageMap = new Map<string, string>();
     enabledFIP = ["8", "7", "3"]
 
     authenticationPage = 'register'
 
     formHeading = new Subject<any>();
 
     messagePopupData = new Subject<any>(); // To send message to global message popup
     globalMessagePopupVisibility = new Subject<boolean>(); // To change visibility of the global message popup
 
     isLoading = new BehaviorSubject(false);
 
     hideNavigation = new BehaviorSubject(true);
 
 
 
     /**
      * disable body scrolling on popup open
      */
     disableBodyScroll() {
         document.body.classList.add('body-has-loader');
     }
 
     /**
      * enable body scrolling on popup close
      */
     enableBodyScroll() {
         document.body.classList.remove('body-has-loader');
     }
 
     /**
      * this function is used for pdf to dowload/open-in-new-tab
      * @param response - pdf bob data
      */
     downloadFile(response, fileName) {
         if (response.status != 'failure') {
             const blob = new Blob([response._body], { type: 'application/pdf' });
             // saveAs(blob, fileName);
 
             // IE doesn't allow using a blob object directly as link href
             // instead it is necessary to use msSaveOrOpenBlob
             if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                 window.navigator.msSaveOrOpenBlob(blob);
                 return;
             }
 
             // For other browsers: 
             // Create a link pointing to the ObjectURL containing the blob.
             const data = window.URL.createObjectURL(blob);
             // var link = document.createElement('a');
             // link.setAttribute('target', '_blank');
             // link.href = data;
             var is_safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
 
             if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) { //Safari & Opera iOS
                 // var url = window.URL.createObjectURL(blob);
                 window.location.href = data; // if it doesn't work, change 'data' to 'url' and uncomment above line
             } else if (is_safari) {
                 this.openTab(data);
             } else {
                 window.open(data);
             }
             setTimeout(function () {
                 // For Firefox it is necessary to delay revoking the ObjectURL
                 window.URL.revokeObjectURL(data);
             }, 100)
         }
     }
 
     /**
      * this function is purely for Safari browser to open the file url in new tab
      * @param url {string} - url of the file
      */
     openTab(url) {
         // Create link in memory
         var a = window.document.createElement("a");
         a.target = '_blank';
         a.href = url;
 
         // Dispatch fake click
         var e = window.document.createEvent("MouseEvents");
         e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
         a.dispatchEvent(e);
     }
 
 
     /*this function is used to get the list of identifier*/
     getUserIdentifiers() {
         let options = {
             type: 'get',
             url: 'userIdentifier',
             includeUserSession: true,
         }
         return this.httpService.makeHttpRequest(options);
     }
 
     postIdentifiersInfo(identifierInfo) {
         identifierInfo.verificationStatus = "verified"; //For now sending verified manually
 
         let options = {
             type: 'post',
             url: 'userIdentifier',
             includeUserSession: true,
             body: identifierInfo
         }
         return this.httpService.makeHttpRequest(options);
     }
 
     deleteIdentifier(identifierId) {
         let options = {
             type: 'delete',
             url: 'userIdentifier',
             includeUserSession: true,
             pathVariables: [identifierId],
         }
         return this.httpService.makeHttpRequest(options);
     }
 
     /**
      * To return global message data obsrevable
      * @returns global message data obsrevable
      */
     getGlobalMessageObservable(): Subject<any> {
         return this.messagePopupData;
     }
 
     /**
      * To produce observable data to be subscribed
      * @param messageData {any} message popup data
      */
     showGlobalMessage(popuptext: any): void {
         popuptext.confirmCallBack = this.toggleGlobalMessagePopupVisibility.bind(this);
         let popupData = new DynamicItem(MessagesComponent, popuptext);
 
         this.messagePopupData.next(popupData);
         this.globalMessagePopupVisibility.next(true);
     }
 
     /**
      * To get the global message popup visibility observable
      */
     getGlobalMessagePopupVisibility(): Subject<boolean> {
         return this.globalMessagePopupVisibility;
     }
 
     /**
      * To toggle global message popup visibility
      * @param visibility {boolean} global message popup visibility 
      */
     toggleGlobalMessagePopupVisibility(visibility: boolean): void {
         this.globalMessagePopupVisibility.next(visibility);
     }
 
     /**
      * update form heading
      * @param value 
      */
     updateFormHeading(value) {
         this.formHeading.next(value)
     }
 
     updateUserData(form) {
         this.userDetails.userNumber = form.mobileNumber.value;
         this.userDetails.userName = form.userName.value;
         //this.formDefinationService.vuaCreationInputsConfig[0].value = this.userDetails.userNumber + this.vuaExtension
         this.formDefinationService.vuaCreationInputsConfig[0].value = this.userDetails.userNumber
     }
 
     setConsentStatus(consentStatus) {
         if (consentStatus == 'PENDING') {
             this.isConsentEditStatus = true
         }
         else {
             this.isConsentEditStatus = false
         }
     }
 
     /**
      * 
      * @param arrayOfObjects It is the array of object whihc needs to be lexiographically sorted
      * @param prop t is the property value which is considered while sorting
      */
     lexiographicallySortArray(arrayOfObjects, prop) {
         arrayOfObjects.sort(this.sortFactory(prop))
         return arrayOfObjects;
     }
     /**
      * Reference from https://stackoverflow.com/a/8539989/11494804
      * @param prop It is the property value which is considered while sorting 
      */
     sortFactory(prop) {
         return function (a, b) { return a[prop].localeCompare(b[prop]); };
     }
 
     getConsentStatusText(log) {
         let desc, logo, name;
         let FIPString = localStorage.getItem("fips");
         let FIPs = JSON.parse(FIPString) || [];
         let FIUString = localStorage.getItem("fius");
         let FIUs = JSON.parse(FIUString) || [];
         //let profileActions = ["RESET_LOGIN_PIN", "CHANGE_LOGIN_PIN", "CHANGE_PASSWORD", "CONFIRM_FORGOT_PASSWORD", "CHANGE_NAME", "CHANGE_MOBILE_NUMBER"];
         let consentActions = ["CONSENT_REQUEST", "CONSENT_APPROVED", "CONSENT_REJECT", "CONSENT_PAUSED", "CONSENT_RESUMED", "CONSENT_REVOKED", "CONSENT_CONFIRMED", "CONSENT_EXPIRED", "DATA_REQUEST", "DATA_FETCH", "DATA_REQUEST_APPROVAL", "FI_DATA_PURGE"];
         let accountActions = ["LINK_ACCOUNT", "DISCOVER_ACCOUNT", "DELINK_ACCOUNT", "CONFIRM_LINK_ACCOUNT"];
         switch (log.eventType) {
             case "DISCOVER_ACCOUNT":
                 desc = "successfullyDiscoveredThisAccount";
                 break;
             case "LINK_ACCOUNT":
                 desc = "otpSentSuccessfully";
                 break;
             case "CONFIRM_LINK_ACCOUNT":
                 desc = "youLinkedThisAccount";
                 break;
             case "DELINK_ACCOUNT":
                 desc = "youDelinkedThisAccount";
                 break;
             case "CONSENT_REQUEST":
                 desc = "consentRequested";
                 break;
             case "CONSENT_APPROVED":
                 desc = "consentApproved";
                 break;
             case "CONSENT_REJECT":
                 desc = "consentRejected";
                 break;
             case "CONSENT_PAUSED":
                 desc = "consentPaused";
                 break;
             case "CONSENT_RESUMED":
                 desc = "consentResumed";
                 break;
             case "CONSENT_REVOKED":
                 desc = "consentRevoked";
                 break;
             case "CONSENT_CONFIRMED":
                 desc = "consentConfirmed";
                 break;
             case "CONSENT_EXPIRED":
                 desc = "consentExpired";
                 break;
             case "DATA_REQUEST":
                 desc = "dataRequested";
                 break;
             case "DATA_REQUEST_APPROVAL":
                 desc = "dataRequestApproved";
                 break;
             case "RESET_LOGIN_PIN":
                 desc = "updatedLoginPin";
                 break;
             case "CHANGE_LOGIN_PIN":
                 desc = "updatedLoginPin";
                 break;
             case "CHANGE_NAME":
                 desc = "updatedName";
                 break;
             case "CHANGE_MOBILE_NUMBER":
                 desc = "updatedMobileNumber";
                 break;
             case "CHANGE_PASSWORD":
                 desc = "yourPINHasBeenChangedSuccessfully";
                 break;
             case "CONFIRM_FORGOT_PASSWORD":
                 desc = "yourPinHasBeenResetSuccessfully";
                 break;
             case "CONFIRM_USER":
                 desc = "confirmedSuccessfully";
                 break;
             case "USER_SIGNUP":
                 desc = "registeredSuccessfully";
                 break;
             case "FI_DATA_PURGE":
                 desc = "dataPurgedSuccessfully";
                 break;
             case "DATA_FETCH":
                 desc = "dataFetched";
                 break;
             default:
                 desc = log.eventType;
         }
         // console.log(log, "logggggggggg")
         if (accountActions.indexOf(log.eventType) >= 0) {
             if (log.eventData.fipID) {
                 let fi = FIPs.find((FIP) => FIP.fipID == log.eventData.fipID) || {};
                 logo = (fi && fi.smallUrl) || "fi";
                 name = fi.fipName;
             } else if (log.eventData.accountIds) {
                 let accountId = log.eventData.accountIds[0];
                 let userAccounts = JSON.parse(localStorage.getItem("userAccounts"));
                 let account = userAccounts.find(userAccount => userAccount.userAccountID == accountId) || {};
                 let fipId = account.fipID;
                 let fi =
                     FIPs.find(FIP => FIP.fipID == fipId) ||
                     {};
                 logo = (fi && fi.smallUrl) || "fi";
                 name = fi.fipName;
             } else if (log.eventData.accounts) {
                 let accountId = log.eventData.accounts[0];
                 let fipId = accountId.fipID;
                 let fi =
                     FIPs.find(FIP => FIP.fipID == fipId) ||
                     {};
                 logo = (fi && fi.smallUrl) || "fi";
                 name = fi.fipName;
             } else {
                 logo = "profile";
                 name = "";
             }
         } else if (consentActions.indexOf(log.eventType) >= 0) {
             let fi = FIUs.find((FIU) => FIU.fiuID == log.eventData.fiuID) || {};
             logo = (fi && fi.smallUrl) || "fi";
             name = fi.fiuName;
         } else {
             logo = "assets/images/svgs/profile.png";
             name = "";
         }
         // console.log(name, logo, desc, "aaaaaaaaaaaa");
         return {
             logo,
             name,
             desc
         }
 
     }
 
     /**
      * Get masked account list
      * @param activityLog 
      */
     getAccounts(activityLog) {
         let accounts = [], maskAccounts;
         switch (activityLog.eventType) {
             case "DISCOVER_ACCOUNT":
                 if(activityLog.eventData.accountsList) {
                     activityLog.eventData.accountsList.forEach(acc => {
                         accounts.push(acc.maskedAccNumber);
                     })
                 } else if(activityLog.eventData.accounts) {
                     activityLog.eventData.accounts.forEach(acc => {
                         accounts.push(acc.accountMaskNumber);
                     })
                 }
                 break;
             case "CONFIRM_LINK_ACCOUNT":
                 if(activityLog.eventData.accounts) {
                     activityLog.eventData.accounts.forEach(acc => {
                         accounts.push(acc.accountMaskNumber);
                     })
                 }
                 break;
             case "LINK_ACCOUNT":
                 if(activityLog.eventData.accounts) {
                     activityLog.eventData.accounts.forEach(accoun => {
                         accounts.push(accoun.accountMaskNumber);
                     })
                 }
                 break;
             case "DELINK_ACCOUNT":
                 if(activityLog.eventData.accounts) {
                     activityLog.eventData.accounts.forEach(ac => {
                         accounts.push(ac.accountMaskNumber);
                     })
                 }
                 break;
             default:
                 accounts = [];
         }
         maskAccounts = accounts.join(", ");
         return {
             maskAccounts
         }
     }
 
     /**
      * Not to include event logs, if not present in eventList
      * @param activityLogs
      */
     filterRecentActivityLogs(activityLogs){
         let eventsList = [
             "RESET_LOGIN_PIN", "CHANGE_LOGIN_PIN", "CHANGE_PASSWORD", 
             "CONFIRM_FORGOT_PASSWORD", "CHANGE_NAME", "CHANGE_MOBILE_NUMBER",
             "CONSENT_REQUEST", "CONSENT_APPROVED", "CONSENT_REJECT", 
             "CONSENT_PAUSED", "CONSENT_RESUMED", "CONSENT_REVOKED", 
             "CONSENT_CONFIRMED", "CONSENT_EXPIRED", "DATA_REQUEST", "DATA_FETCH", 
             "DATA_REQUEST_APPROVAL", "FI_DATA_PURGE", "LINK_ACCOUNT", 
             "DISCOVER_ACCOUNT", "DELINK_ACCOUNT", "CONFIRM_LINK_ACCOUNT"
         ];
         let filteredLogs = activityLogs.filter(log => {
             return eventsList.indexOf(log.eventType) >= 0 
         })
         return filteredLogs;   
     }
 
     getActivityLogLogo(eventType) {
     }
 
     /**
      * 
      * @param arr1  
      * @param arr2
      * Arrays for which we need to find the intersection.
      * This will return the array with common elements in @arr1 and @arr2
      */
     arrayIntersection(arr1, arr2) {
         let referenceArray = arr1;
         let otherArray = arr2;
         let commonArray = [];
         if (arr1.length >= arr2.length) {
             referenceArray = arr2;
             otherArray = arr1;
         }
         referenceArray.forEach(element => {
             if (otherArray.indexOf(element) > -1) {
                 commonArray.push(element);
             }
         });
         return commonArray;
     }
 
     updateUserAccounts() {
         let options = {
             url: "dashboard",
             type: "get",
             isDeveloper: true,
             includeUserSession: true
         };
         this.httpService.makeHttpRequestWOLoader(options).subscribe(res => {
             if (res && res.bankAccounts && res.bankAccounts.length) {
                 localStorage.setItem("userAccounts", JSON.stringify(res.bankAccounts));
             } else if (res && res.bankAccounts && !res.bankAccounts.length) {
                 localStorage.removeItem("userAccounts");
             }
         })
     }
 
     initSupportedLanguages() {
         this.languageMap.set('en', 'English');
         this.languageMap.set('hi', 'हिंदी');
         this.translate.addLangs(Array.from(this.languageMap.keys()));
     }
 
     getSupportedLanguagesMap() {
         return this.languageMap;
     }
 
     initDefaultLanguage() {
         let storedDefLang = localStorage.getItem('lang');
         if (storedDefLang != null) {
              this.translate.setDefaultLang(storedDefLang);
              this.translate.use(storedDefLang);
         } else {
              this.translate.setDefaultLang('en')
             localStorage.setItem('lang', 'en');
              this.translate.use('en');
         }
     }
 
     setDefaultLanguage(lang: string) {
          this.translate.setDefaultLang(lang);
          this.translate.use(lang);
         localStorage.setItem('lang', lang);
     }
 
     getDefaultLanguage() {
          return this.translate.getDefaultLang();
     }
 
     getErrorStringFor(errorCode: string, apiName: string) {
         let genericMessage = 'somethingWentWrongPleaseRetryAfterAnHour';
         switch (errorCode) {
             case 'INVALID_LOGIN_CRED':
                 return 'invalidMobileNumberOrPinPleaseTryAgain';
             case 'USER_NOT_FOUND':
                 if (apiName == 'login' || apiName == 'forgotPassword' || apiName == 'confirmPassword')
                     return 'providedMobileNumberIsNotFoundPleaseVerify';
                 else if (apiName == 'mobileOtp')
                     return 'somethingWentWrongDuringSignupPleaseTryAgain';
                 else if (apiName == 'vua')
                     return 'somethingWentWrongWhileSettingUpVuaForYouPleaseTryAgain';
                 else return genericMessage;
             case 'ERR_USER_EXIST':
                 return 'theMobileNumberAlreadyExistsPleaseUse';
             case 'INVALID_VUA_FORMAT':
                 return 'somethingWentWrongWhileSettingUpVuaForYouPleaseTryAgain';
             case 'OLD_NEW_PASSWORD_SAME':
                 return 'oldAndNewPinCannotNotBeTheSame';
             case 'TOO_MANY_REQUEST_CHANGE_PASSWORD':
                 return 'tooManyAttemptsMadeToChangePinPleaseRetryAfter24Hours';
             case 'ACCOUNT_NOT_FOUND':
                 if (apiName == 'discoveredAccounts')
                     return 'allAccountsAreAlreadyLinkedFromThisInstitution';
                 else if (apiName == 'accountdiscover')
                     return 'noAccountsFound';
                 else if (apiName == 'accountOtp')
                     return 'unableToLinkOneOrMoreAccountsPleaseTryAgainLater';
                 else if (apiName == 'accountDelink')
                     return 'accountDelinkingFailedPleaseTryAgainLater';
                 else
                     return genericMessage;
             case 'ACCOUNT_LINKED_ALREADY':
                 return 'thisAccountIsAlreadyLinked';
             case 'INVALID_LINK_ACCOUNT_ACTION':
                 return 'unableToLinkOneOrMoreAccountsPleaseTryAgainLater';
             case 'ACCOUNT_ALREADY_DELINK':
                 return 'accountIsAlreadyDelinked';
             case 'CONSENT_NOT_IN_PENDING_STATE':
             case 'CONSENT_ALREADY_APPROVED':
                 return 'consentAlreadyApproved';
             case 'CONSENT_REJECT_ALREADY_APPROVED':
                 return 'cannotRejectAnAlreadyApprovedConsentRequest';
             case 'CONSENT_CANT_UPDATE':
             case 'CONSENT_PENDING_STATE':
                 return 'somethingWentWrongUnableToUpdateConsentStatus';
             case 'UNAUTHENTICATED':
                 return 'sessionExpiredPleaseLoginToContinue';
             case 'INVALID_OTP':
                 return 'yourEnteredOtpIsInvalidPleaseTryAgain';
             case 'OTP_EXPIRED':
                 return 'yourEnteredOtpWasExpiredPleaseTryAgain';
             case 'OTP_VERIFIED_ALREADY':
                 return 'otpAlreadyVerified';
             case 'OTP_FAILED_TOO_MANY_ATTEMPT':
                 return 'resendOtpLimitExceededPleaseTryAfterAnHour';
             case 'VUA_ALREADY_EXISTS':
                 return 'vuaisalreadyexisted'
             default:
                 return genericMessage;
         }
     }
 
     setRedirectInstanceData(data: { redirect: string, consenthandle: string, txnid: string, sessionid: string, srcref: string, customername: string, mobile: string }) {
         this.redirectInstanceData.consenthandle = data.consenthandle;
         this.redirectInstanceData.redirect = data.redirect;
         this.redirectInstanceData.txnid = data.txnid;
         this.redirectInstanceData.sessionid = data.sessionid;
         this.redirectInstanceData.srcref = data.srcref;
         this.redirectInstanceData.customername = data.customername;
         this.redirectInstanceData.mobile = data.mobile;
     }
 
     getRedirectInstanceData() {
         return this.redirectInstanceData;
     }
 
     getFinalRedirectUrlAndClearUserData(status: string, errorCode: number, vua: string) {
         this.userService.clearUserData();
         var returnUrl = this.redirectInstanceData.redirect + '?txnid=' + this.redirectInstanceData.txnid + '&sessionid=' + this.redirectInstanceData.sessionid + '&srcref=' + this.redirectInstanceData.srcref + '&status=' + status + '&errorCode=' + errorCode;
         if (vua) {
             returnUrl = returnUrl + '&vua=' + vua;
         }
         return returnUrl;
     }
 
 
     redirectBack(toastType: string, message: string, status: string, errorCode: number, vua: string) {
         let timeout: number = 3000;
         this.loader.toggleLoader(true);
         this.loader.showToast(toastType, message, false, timeout);
         setInterval(() => {
             this.isRedirectInstance = false;
             this.loader.toggleLoader(false);
             window.location.href = this.getFinalRedirectUrlAndClearUserData(status, errorCode, vua);
         }, timeout);
     }
 
     isValidName(name: string): boolean {
         var regex = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
         // var regex = /^[A-Za-z]{1,}$/;
         var multipleSpaces = false;
         var found = regex.test(name);
         if (found && name) {
             for (let i = 0; i < name.length; i++) {
                 if (name[i] == ' ' && name[i + 1] == ' ') {
                     multipleSpaces = true;
                 }
             }
         }
         return (found && !multipleSpaces) ? true : false;
     }
 
     isValidMobileNumber(mobileNumber: string): boolean {
         var regex = /^[6-9]{1}[0-9]{9}$/;
         var found = regex.test(mobileNumber);
         return found ? true : false;
     }
 
 }
 