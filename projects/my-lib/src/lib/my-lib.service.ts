import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';


const APINAME = {
  userProfile: 'user/user-profile',
  discover: 'sdk/api/v1/accounts/discover',
  authtrigger: 'sdk/api/v1/account/auth/trigger',
  accountverify: 'sdk/api/v1/account/auth/verify',
  loginOTPVerify: 'app/loginwithotp/verify',
  accountlist: 'sdk/api/v1/linkedaccount/list',
  discoveredaccountlist: 'sdk/api/v1/discoveredaccount/list',
  logout: 'user/logout',
  loginOTPSend: 'app/loginwithotp/send',
  OTPSend:'app/otp/send',

  verifyvua: 'user/verifyvua',
  userRegistration: 'user/sdksignupwithotp/send',
  verifyotp: 'user/sdksignupwithotp/verify',
  regascorpuser: 'sdk/api/v1/session/init',
  fipList: 'app/fip',
  

  // concent approval and rejection.
  customerDashboard: 'app/dashboard',
  consentDetails: 'sdk/api/v1/bulkconsent/info',
  approveConsent: 'sdk/api/v1/consentwithauth/allow',
  rejectConsent: 'sdk/api/v1/consentwithauth/deny',

  consentAllow: 'sdk/api/v1/consent/allow',
  consentDeny: 'sdk/api/v1/consent/deny',
  multiAccountlink: 'sdk/api/v1/bulkaccount/auth/trigger',
  //Phase 3 new APIs
  otpValidate:'app/otp/validate',
  verifyProfileVua:'user/verifyprofile',
  //discover API 
  accountdiscover:'sdk/api/v1/accounts/discover/multiplefips'
};
@Injectable({
  providedIn:'root'
})

export class MyLibService {
  url: string;

  constructor(private http: HttpClient, private envService: EnvService) {
    this.url = this.envService.apiUrl;
  }


  /**
   * To discover accounts
   * @param fipId
   * @param identifier
   * @param sessionId
   */
  discoverAccount(fipId: string, identifier: { category: string, type: string, value: string }[], sessionId?: string) {
    try {
      if (!fipId && !identifier) { throw new Error('Flip Id && Identifier is required'); }
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.discover}`,
      };
      const data: any = {
        headers: header,
        body: {
          identifiers: [{
            category: `${identifier[0].category}`, type: `${identifier[0].type}`,
            value: `${identifier[0].value}`
          }], fipId: `${fipId}`
        }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * To get list of discovered acccounts
   * @param body
   * @param sessionId
   */
  getUserProfile(sessionId?: string) {
    try {
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'GET',
        url: `${this.url}${APINAME.userProfile}`,
      };
      const data: any = {
        headers: header,
        };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }
  /**
   * To auth Trigger accounts // Link Accounts with OTP SEND
   * @param account
   * @param sessionId
   */
  accountAuth(account: {
    type: string, data: {
      accType: string, accRefNumber: string,
      maskedAccNumber: string, fipId: string, userInfo: {}
    }
  },          sessionId?: string) {
    try {
      if (!account) { throw new Error('Account is required'); }
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.authtrigger}`,
      };
      const data: any = {
        headers: header,
        body: {
          account: {
            type: `${account.type}`, data: {
              accType: `${account.data.accType}`,
              // tslint:disable-next-line: max-line-length
              accRefNumber: `${account.data.accRefNumber}`, maskedAccNumber: `${account.data.maskedAccNumber}`, fiId: `${account.data.fipId}`, userInfo: `${account.data.userInfo}`
            }
          }
        }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * To auth Trigger accounts // Link Accounts with OTP Verify
   * @param refNumber
   * @param authToken
   * @param sessionId
   */
  accountVerify(refNumber: string, authToken: string, sessionId?: string) {
    try {
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`,
      });

      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.accountverify}`,
      };
      const data: any = {
        headers: header,
        body: { refNumber: `${refNumber}`, authToken: `${authToken}` }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * To auth Trigger accounts // Link Accounts with OTP Verify
   * @param organisationId
   * @param client_id
   * @param client_secret
   * @param appIdentifier
   * @param phone_number
   */
  loginOTP(organisationId: string, client_id: string, client_secret: string,
           appIdentifier:[{ appName?:String, appIdentifier: string }], phone_number: string) {
    try {
      if (!organisationId) { throw new Error('organisationId is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        organisationId: `${organisationId}`,
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        appIdentifier: `${appIdentifier}`
      });
      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.loginOTPSend}`,
      };
      const data: any = {
        headers: header,
        body: { phone_number: `${phone_number}` }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Login otp validation for a user session, through the SDK // Link Accounts with OTP Verify.
   * @param organisationId
   * @param client_id
   * @param client_secret
   * @param appIdentifier
   * @param phone_number
   * @param otp_reference
   * @param code
   */
  loginOTPVerify(organisationId: string, client_id: string, client_secret: string,
                 appIdentifier: {appName?: string, appIdentifier: string }[], phone_number: string, otp_reference: string, code: string) {
    try {
      if (!organisationId) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        organisationId: `${organisationId}`,
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        appIdentifier: `${appIdentifier}`
      });

      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.loginOTPVerify}`,
      };
      const data: any = {
        headers: header,
        body: { phone_number: `${phone_number}`, otp_reference: `${otp_reference}`, code: `${code}` }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            if (response.sessionId) { sessionStorage.setItem('sessionId', response.sessionId); }
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * GET Linked Accounts List.
   * @param sessionId
   * Returns the list of linked accounts by the customer.
   */
  getListOfLinkedAccounts(sessionId?: string) {
    try {
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'GET',
        url: `${this.url}${APINAME.accountlist}`,
      };
      const data: any = {
        headers: header
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  /**
   * GET Discovered Accounts List
   * @param sessionId
   * Returns the list of discovered accounts.
   */
  getDiscoveredAccountList(sessionId?: string) {
    try {
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'GET',
        url: `${this.url}${APINAME.discoveredaccountlist}`,
      };
      const data: any = {
        headers: header
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * POST Logout // Intended for a consent manager to enable a user to logout of his session.
   * @param sessionId
   */
  logout(sessionId?: string) {
    try {
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.logout}`,
      };
      const data: any = {
        headers: header
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Verify uva
   * @param organisationid
   * @param clientId
   * @param clientSecret
   * @param appIdentifier
   * @param body
   */
  verifyVua(organisationid: string, clientId: string, clientSecret: string, appIdentifier: { appName?: string, appIdentifier: string }[],
            body: { vua: string }): any {
    try {
      if (!organisationid || !clientId || !clientSecret || !body) { throw new Error('All parameters are required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          organisationId: organisationid,
          client_id: clientId,
          client_secret: clientSecret,
          appIdentifier: `${appIdentifier}`
        }),
        body: body ? body : null,
      };
      return this.http
        .request('POST', this.url + APINAME.verifyvua, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * User Registration
   * @param organisationid
   * @param clientId
   * @param clientSecret
   * @param body
   */
  userRegistration(organisationid: string, clientId: string, clientSecret: string,
                   appIdentifier: { appName?: string, appIdentifier: string }[], body: {
                   name: string, phone_number: string, terms_and_conditions: boolean, vua: string }): any {
    try {
      if (!organisationid || !clientId || !clientSecret || !body) { throw new Error('All parameters are required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          organisationId: organisationid,
          client_id: clientId,
          client_secret: clientSecret,
          appIdentifier: `${appIdentifier}`
        }),
        body: body ? body : null,
      };
      return this.http
        .request('POST', this.url + APINAME.userRegistration, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Verify OTP
   * @param organisationid
   * @param clientId
   * @param clientSecret
   * @param body
   */
  verifyOtp(organisationid: string, clientId: string, clientSecret: string,
            appIdentifier: { appName?: string, appIdentifier: string }[],
            body: { phone_number: string, otp_reference: string, code: string }): any {

    try {
      if (!organisationid || !clientId || !clientSecret || !body) { throw new Error('All parameters are required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          organisationId: organisationid,
          client_id: clientId,
          client_secret: clientSecret,
          appIdentifier: `${appIdentifier}`
        }),
        body: body ? body : null,
      };
      return this.http
        .request('POST', this.url + APINAME.verifyotp, data)
        .pipe(
          map(res => {
            const response: any = res;
            if (response.status && response.sessionId) {
              sessionStorage.setItem('sessionId', response.sessionId);
            }
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Register as Corporate User.
   * @param body
   */
  registerAsCorpUser(body: { mobileNumber: string, timestamp: string, pan: string }): any {
    try {
      if (!body) { throw new Error('All parameters are required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: body ? body : null,
      };
      return this.http
        .request('POST', this.url + APINAME.regascorpuser, data)
        .pipe(
          map(res => {
            const response: any = res;
            if (response.status === 'SUCCESS' && response.sessionToken) {
              sessionStorage.setItem('sessionToken', response.sessionToken);
            }
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Get FIP List.
   * @param sessionId
   */
  getFipList(sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
      };
      return this.http
        .request('GET', this.url + APINAME.fipList, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  // concent approval and rejection.

  /**
   * Customer Dashboard/
   * @param sessionId
   */
  customerDashboard(sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
      };
      return this.http
        .request('GET', this.url + APINAME.customerDashboard, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  /**
   * Consent Request Details
   * @param sessionId
   * @param body
   */
  getConsentDetails(body: { consentHandles: string[] }, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.consentDetails, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  /**
   * Approve Consent with Authentication
   * @param sessionId
   * @param body
   */
  approve(body: {consentHandle: string, otp: string, accounts: {type: string, data: {accType: string,
          accRefNumber: string, maskedAccNumber: string, fipId: string, userInfo: {}}}[]},
          sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.approveConsent, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }
  /**
   * Reject Consent with Authentication
   * @param sessionId
   * @param body
   */
  reject(body: { consentHandle: string, otp: string }, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.rejectConsent, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Reject Consent with Authentication
   * @param sessionId
   * @param body
   */
  consentOTP(body: { actionType: string,identifierValue:string,identifierType:string }, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.OTPSend, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

 
  /**
   * Consent Allow
   * @param body
   * @param sessionId
   */
  consentAllow(body: { consentHandle: string,
    accounts: {
        type: string,
        data: {
          accType: string,
          accRefNumber: string,
          maskedAccNumber: string,
          fipId: string,
          userInfo: {}}
      }[]}, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid,
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST',this.url + APINAME.consentAllow, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  /**
   * Consent Deny
   * @param body
   * @param sessionId
   */
  consentDeny(body: { consentHandle: string}, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.consentDeny, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }


  /**
   * Multi Account Link
   * @param body
   * @param sessionId
   */
  multiAccountlink(body: { 
    accounts: {
        type: string,
        data: {
          accType: string,
          accRefNumber: string,
          maskedAccNumber: string,
          fipId: string,
          userInfo: {}}
      }[]}, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.multiAccountlink, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }
// identifierGenerateOTP
// identifierVerifyOTP
/**
   * OTP Generation without action Type
   * @param sessionId
   * @param body
   */
  identifierGenerateOTP(body: { identifierValue:string,identifierType:string }, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? {actionType:'VERIFY_IDENTIFIER', ...body } : null
      };
      return this.http
        .request('POST', this.url + APINAME.OTPSend, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

 /**
   * OTP Validation
   * @param body
   * @param sessionId
   */
  identifierVerifyOTP(body: { 
    actionType:String,
    OTP:String,
    identifierValue:String,
    identifierType:string
    }, sessionId?: string): any {
    try {
      const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionid || !body) { throw new Error('Session Id is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          sessionId: sessionid
        }),
        body: body ? {actionType:'VERIFY_IDENTIFIER', ...body } : null
      };
      return this.http
        .request('POST', this.url + APINAME.otpValidate, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }
  /**
   * Check mobile number VUA
   * @param body
   * @param sessionId
   */
  verifyOnemoneyProfile(organisationid: string, clientId: string, clientSecret: string,
    appIdentifier: { appName?: string, appIdentifier: string }[],
    body: { username: string, }): any {
    try {
      //const sessionid = sessionId || sessionStorage.getItem('sessionId');
      if (!body) { throw new Error('Body is required'); }
      const data: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          organisationId: organisationid,
          client_id: clientId,
          client_secret: clientSecret,
          appIdentifier: `${appIdentifier}`,
          
        }),
        body: body ? body : null
      };
      return this.http
        .request('POST', this.url + APINAME.verifyProfileVua, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }

    }

    /**
   * Account discovery API
   * @param body
   * @param sessionId
   */
  discoverAccountFIP(identifier: { category: string, type: string, value: string }[],fipId?: string, sessionId?: string) {
    try {
      if (!identifier) { throw new Error('Identifier is required'); }
      const sessionID = sessionId || sessionStorage.getItem('sessionId');
      if (!sessionID) { throw new Error('Session Id is required'); }
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        sessionId: `${sessionID}`
      });
      const options = {
        method: 'POST',
        url: `${this.url}${APINAME.accountdiscover}`,
      };
      const data: any = {
        headers: header,
        body: {
          identifiers: [{
            category: `${identifier[0].category}`, type: `${identifier[0].type}`,
            value: `${identifier[0].value}`
          }], fipId: `${fipId}`
        }
      };
      return this.http
        .request(options.method, options.url, data)
        .pipe(
          map(res => {
            const response: any = res;
            return response;
          })
        );
    } catch (error) {
      return of(error);
    }
  }

}
