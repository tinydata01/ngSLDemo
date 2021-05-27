import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  isUserLoggedin = new Subject<boolean>();
  data: any[] =[]

  constructor(private router: Router, private http: HttpClient) { }

  /**
     * checkong header visibility on the page
     */
  getHeaderVisibility() {
    return this.isUserLoggedin;
  }

  logoutUser() {
    this.clearUserData()
    this.router.navigate(['/login']);
  }

  clearUserData() {
    localStorage.clear();
    this.isUserLoggedin.next(false);
  }

  getUserData() {
    let userData = localStorage.getItem('userDetails');
    if (!userData) {
      return {};
    }
    return JSON.parse(userData);
  }
  
  load() {
    const jsonFile = '../assets/config.json';
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: any) => {
        this.data = <any>response;
        resolve();
      }).catch((response: any) => {
        reject('Failed')
      });
    });
  }
}
