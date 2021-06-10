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
  discoveredAccountsLength: any = 2;
  ngOnInit() {
    this.http.showThrobber();
    this.userMobileNumber = localStorage.getItem("mobileNumber");
    // // this.oneMoneyService.getFipList().subscribe(res => {
    // this.FIs = [
    //   {
    //     FIs: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
    //     code: "INDUSIND",
    //     discoverOTP: false,
    //     fipID: "INDUSIND",
    //     fipName: "IndusInd Bank Ltd.",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //     logoUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg",
    //     smallUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg"
    //   },
    //   {
    //     FIs: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
    //     code: "INDUSIND",
    //     discoverOTP: false,
    //     fipID: "INDUSIND",
    //     fipName: "IndusInd Bank Ltd.",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //     logoUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg",
    //     smallUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg"
    //   },
    //   {
    //     FIs: ["DEPOSIT", "TERM-DEPOSIT", "RECURRING_DEPOSIT"],
    //     code: "aujas_alt_fip",
    //     fipID: "aujas_alt_fip",
    //     fipName: "Aujas Alt FIP",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //   }, {
    //     FIs: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
    //     code: "INDUSIND",
    //     discoverOTP: false,
    //     fipID: "INDUSIND",
    //     fipName: "IndusInd Bank Ltd.",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //     logoUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg",
    //     smallUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg"
    //   },
    //   {
    //     FIs: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM-DEPOSIT"],
    //     code: "INDUSIND",
    //     discoverOTP: false,
    //     fipID: "INDUSIND",
    //     fipName: "IndusInd Bank Ltd.",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //     logoUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg",
    //     smallUrl: "https://www.onemoney.in/docs/img/Induslnd_bank.jpg"
    //   },
    //   {
    //     FIs: ["DEPOSIT", "TERM-DEPOSIT", "RECURRING_DEPOSIT"],
    //     code: "aujas_alt_fip",
    //     fipID: "aujas_alt_fip",
    //     fipName: "Aujas Alt FIP",
    //     fipStatus: "ENABLED",
    //     identifiers: [{
    //       identifier: "MOBILE",
    //       identifierType: "STRONG"
    //     }],
    //   },
    // ];
    // let FIPList = localStorage.getItem('fips');
    // if (!FIPList) {
    //   localStorage.setItem('fips', JSON.stringify(this.FIs))
    // }
    // // })
    this.oneMoneyService.getFipList().subscribe(res => {
      this.FIs = res.fipList;
      let FIPList = localStorage.getItem('fips');
      if (!FIPList) {
        localStorage.setItem('fips', JSON.stringify(this.FIs))
      }
    })
    console.log(this.FIs);
    let category = "STRONG";
    let type = "MOBILE";
    let value = this.userMobileNumber;
    // this.oneMoneyService.discoverAccountFIP([{ category: category, type: type, value: value }])
    //   .subscribe(result => {
    this.discoveredAccounts = [
      {
        data: { accType: "SAVINGS", accRefNumber: "aujas-ffe5e7771d", maskedAccNumber: "XXXXXX6577", fipId: "alt_aujas_fip_dev" },
        type: "BANK"
      },
      {
        data: { accType: "SAVINGS", accRefNumber: "aujas-4658938be6", maskedAccNumber: "XXXXXX5996", fipId: "aujas_fip_dev" },
        type: "BANK"
      },
      {
        data: { accType: "SAVINGS", accRefNumber: "c5660-849d-6011", maskedAccNumber: "XXXXXXXX5374", fipId: "aujasbank" },
        type: "BANK"
      },
      {
        data: { accType: "SAVINGS", accRefNumber: "af210-579d-2b94", maskedAccNumber: "XXXXXXXX5651", fipId: "aujasbank" },
        type: "BANK"
      },
      {
        data: { accType: "SAVINGS", accRefNumber: "BANK11111111", maskedAccNumber: "XXXXXXX3468", fipId: "alt_aujasbank" },
        type: "BANK"
      }
    ];
    var account = this.discoveredAccounts.map(x => x.data);
    this.discoveredAccounts = account.map((item) => item.fipId).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
      let new_list = account.filter(itm => itm.fipId == item).map(itm => itm);
      return { fipId: item, itm: new_list }
    });
    this.discoveredAccountsLength = this.discoveredAccounts.length;
    //     this.http.hideThrobber();
    //   })
  }

  selectedFIs(data) {
    data = data.filter(eachData =>
      'identifiers' in eachData);
    this.selectedFis = data
  }
}
