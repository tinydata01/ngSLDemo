import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  consentId: any;

  constructor(private http: HttpService) { }

  getFIPList() {
    let FIPList = localStorage.getItem('fips');
    if(FIPList) {
      return of(JSON.parse(FIPList));
    }
    let options = {
      url: "fipList",
      type: "get",
      isDeveloper: true,
      includeUserSession: true
    };
    return this.http.makeHttpRequest(options);
  }

  getFIUList() {
    let FIUList = localStorage.getItem('fius');
    if(FIUList) {
      return of(JSON.parse(FIUList));
    }
    let options = {
      url: "fiuList",
      type: "get",
      isDeveloper: true,
      includeUserSession: true
    };
    return this.http.makeHttpRequest(options);
  }

  // To get profile data
  getProfileData() {
    // let userDetails = localStorage.getItem('userDetails');
    // if(!userDetails) {
        let options = {
            url: "profile",
            type: "get",
            isDeveloper: true,
            includeUserSession:true,
            body:''       
        }
        this.http.makeHttpRequest(options).subscribe(res=>{
            if(!res || (res && res.status == false)){
                return;
            }
            // userDetails = res.userData
            localStorage.setItem('userDetails',JSON.stringify(res));
        })
    // }
  }

  setConsentId(id) {
    this.consentId = id;
  }

  getConsentId() {
    return this.consentId;
  }

}
