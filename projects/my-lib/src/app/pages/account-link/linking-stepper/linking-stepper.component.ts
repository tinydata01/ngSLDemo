import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { MyLibService as OnemoneyWebsdkService } from '../../../../lib/my-lib.service';


@Component({
  selector: 'app-linking-stepper',
  templateUrl: './linking-stepper.component.html',
  styleUrls: ['./linking-stepper.component.scss']
})
export class LinkingStepperComponent implements OnInit {
  accountsData: any;
  FIs: any;
  selectedFis: any;
  userMobileNumber: any;
  constructor(
    private http: HttpService,
    private oneMoneyService: OnemoneyWebsdkService) {
  }
  sessionId: any;
  discoveredAccounts: any;
  discoveredAccountsLength: any;
  ngOnInit() {
    this.http.showThrobber();
    this.userMobileNumber = localStorage.getItem("mobileNumber");
    this.oneMoneyService.getFipList().subscribe(res => {
      this.FIs = res.fipList;
      let FIPList = localStorage.getItem('fips');
      if (!FIPList) {
        localStorage.setItem('fips', JSON.stringify(this.FIs))
      }
    })

    let category = "STRONG";
    let type = "MOBILE";
    let value = this.userMobileNumber;
    this.oneMoneyService.discoverAccountFIP([{ category: category, type: type, value: value }])
      .subscribe(result => {
        this.discoveredAccounts = result.accounts;
        var account = this.discoveredAccounts.map(x => x.data);
        this.discoveredAccounts = account.map((item) => item.fipId).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
          let new_list = account.filter(itm => itm.fipId == item).map(itm => itm);
          return { fipId: item, itm: new_list }
        });
        this.discoveredAccountsLength = this.discoveredAccounts.length;
        this.http.hideThrobber();
      })
  }

  selectedFIs(data) {
    data = data.filter(eachData =>
      'identifiers' in eachData);
    this.selectedFis = data
  }
}
