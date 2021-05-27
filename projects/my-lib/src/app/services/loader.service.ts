import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  // Loader flag
  loaderVisibility = new BehaviorSubject(false);
  isToastShown = new BehaviorSubject({ visibility: false });
  consentAccountStatusChange$ = new BehaviorSubject(false); // To update the consent list on consent status change
  message: string = '';

  constructor() { }

  getLoader() {
    return this.loaderVisibility;
  }
  /**
   * @desc To toggle the loader visibility
   * @param  flag
   */
  toggleLoader(flag) {
    this.loaderVisibility.next(flag);
  }

  showToast(status, data, top = false, timeout = 3000) {
    let visibilityDetails = {
      visibility: true,
      status: status,
      data: data,
      top: top
    }
    // visibility = visibility ? visibility : toastStatuses.SUCCESS;
    this.isToastShown.next(visibilityDetails);
    setTimeout(this.hideToast.bind(this), timeout);
  }

  hideToast() {
    this.isToastShown.next({ "visibility": false });
  }

  getToastVisibility() {
    return this.isToastShown;
  }

  getConsentAccountStatusChange() {
    return this.consentAccountStatusChange$;
  }

  changeConsentAccountStatus(bool) {
    this.getConsentAccountStatusChange().next(bool);
  }

  getwebSdkShowMessage() {
    return this.message;
  }

  setwebSdkShowMessage(message) {
    this.message = message;
  }

}
