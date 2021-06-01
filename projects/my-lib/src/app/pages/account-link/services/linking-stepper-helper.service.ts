import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkingStepperHelperService {
  stepperData;
  stepperRawData = {
    "name": "",
    "heading": "",
    "desc": "",
    "steps": [
      {
        "id": "show",
        "name": "selectFinancialInstitutions",
        "desc": "pleaseSelectTheFinancialInstitutionsToProceedWithAccountDiscovery",
        "icon": "link-account",
        "iconInactive": "link-account-inactive",
        "nextStepId": "add",
        "previousStepId": null,
        "active": true,
        "done": false,
        "canEnter": true,
        "canGoToNext": false,
        "canGoToPrev": false,
        "goToNextMessage": "callsnotDoneCompletely",
        "goToBackMessage": "youWillLoseData",
        "component": "add-accounts",
        "cmpntInputData": {},
        "cmpntOutputData": {}
      },
      {
        "id": "add",
        "name": "discoverLinkAccounts",
        "desc": "fetchYourFinancialAccountsWithAnAccountIdentifierLikeMobile",
        "icon": "OTP-infographic",
        "iconInactive": "OTP-infographic-inactive",
        "nextStepId": null,
        "previousStepId": "show",
        "active": false,
        "done": false,
        "canEnter": true,
        "canGoToNext": false,
        "canGoToPrev": false,
        "goToNextMessage": "callsnotDoneCompletely",
        "goToBackMessage": "someOfTheAccountsAreInTheProcessOfBeing",
        "component": "add-accounts",
        "cmpntInputData": {},
        "cmpntOutputData": {}
      },
      // {
      //   "id": "link",
      //   "name": "Link accounts",
      //   "desc": "You are almost done please select your accounts like to link",
      //   "icon": "link",
      //   "iconInactive": "link-inactive",
      //   "nextStepId": null,
      //   "previousStepId": "add",
      //   "active": false,
      //   "done": false,
      //   "canEnter": true,
      //   "canGoToNext": false,
      //   "canGoToPrev": false,
      //   "goToNextMessage": "Calls not done completely",
      //   "goToBackMessage": "You will lose data",
      //   "component": "link-accounts",
      //   "cmpntInputData": {},
      //   "cmpntOutputData": {}
      // }
    ]
  }

  searchFilters;
  searchFiltersRawData ={
      "name" : "",
      "heading" : "",
      "desc": "",
      "filters": [
        {
            name : "bank",
            value : "BANKS"
        },
        {
            name : "insurance",
            value : "INSURANCE"
        },
        {
            name : "nbfc",
            value : "NBFC"
        }
      ]
  }

  consentId: any; //This stores the id of the consent from which user came to Account linking screen.

  constructor() {
    this.initStepperData();
    this.initFilterData();
  }

  dataObj = {
    SELECTED_ACCOUNTS: "selectedAccounts",
    DISCOVERED_ACCOUNTS: "discoveredAccounts"
  }
  data: any = {};

  setData(key, value) {
    this.data[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  initStepperData() {
    this.stepperData = JSON.parse(JSON.stringify(this.stepperRawData));
  }

  getStepperData() {
    return this.stepperData;
  }

  initFilterData(){
      this.searchFilters = JSON.parse(JSON.stringify(this.searchFiltersRawData))
  }

  getFilterData() {
    return this.searchFilters;
  }

  getCurrentStep(stepId?) {
    let currentStepIndex;
    if(stepId) {
      currentStepIndex = this.stepperData.steps.findIndex((step) => step.id == stepId);
    } else {
      currentStepIndex = this.stepperData.steps.findIndex((step) => step.active);
    }
    if(currentStepIndex >= 0) {
      return this.stepperData.steps[currentStepIndex];
    }
  }

  markCurrentStepAsDone(bool = true) {
    let currentStep = this.getCurrentStep();
    if(currentStep) {

      currentStep.done = bool;
    }
  }

  gotoNextStep() {
    let currentStep = this.getCurrentStep();
    if(currentStep) {
      if(!currentStep.done) {
        return false; 
      }
    }
    let nextStepId = currentStep.nextStepId;
    this.gotoStep(nextStepId);
  }

  gotoStep(stepId) {
    if(!stepId) {
      return;
    }
    let destStep = this.getCurrentStep(stepId);
    if(destStep.canEnter) {
      this.getStepperData().steps.forEach((step) => {
        step.active = false;
      });
      destStep.active = true;
    }
  }

  setConsentId(id){
      this.consentId = id;
  }

  resetConsentId(){
      this.consentId = '';
  }

  getConsentId(){
      return this.consentId;
  }

}
