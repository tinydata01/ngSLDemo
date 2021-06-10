import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //API URL for Onemoney Web
  public apiUrl = 'https://app-uat.onemoney.in/';
  public uatUrl = 'https://app-uat.onemoney.in/';
  public prodUrl = 'https://aa-app.onemoney.in/';
  public devUrl = 'https://dev-aa-app.aws.onemoney.in/';

  //public prodUrl = 'https://api-sandbox.onemoney.in/';


  //Base URL for Web SDK of Onemoney Server
  public omApiUrl = '';
  public enableDebug = true;

  constructor() { }
}
