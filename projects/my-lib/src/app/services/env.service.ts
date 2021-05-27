import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //API URL for Onemoney Web
  public apiUrl = '';
  
  //Base URL for Web SDK of Onemoney Server
  public omApiUrl = '';
  public enableDebug = true;

  constructor() { }
}
