import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { utilService } from '../../../../services/util.service';
import { LinkingStepperHelperService } from '../../services/linking-stepper-helper.service';
import { HttpService } from '../../../../services/http.service';
import { CommonService } from '../../../../services/common.service';

import { MyLibService as OnemoneyWebsdkService } from '../../../../../lib/my-lib.service';
@Component({
  selector: 'app-fi-list',
  templateUrl: './fi-list.component.html',
  styleUrls: ['./fi-list.component.scss']
})
export class FIListComponent implements OnInit {
  @Output() selectedFI: EventEmitter<any> = new EventEmitter();
  @Input() filterData?: any;
  @Input() fiData: any
  // = [
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

  FIs: any = []
  searchedFIs: any = [];
  selectedFIs: any = [];
  showFilterMenu: boolean = false;
  selectedFilter;
  windowWidth;
  filterValueArray = [
    'bank',
    'nbfc',
    'insurance'
  ]
  //   filterValue = 'All Institutions' //Put the default selection here

  selectedFIHeading = {
    'font-size': "18px"
  }
  display: any;

  constructor(private util: utilService, private commonService: CommonService,
    private oneMoneyService: OnemoneyWebsdkService,
    private linkHelper: LinkingStepperHelperService, private http: HttpService) {
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    this.oneMoneyService.getFipList().subscribe(res => {
      this.FIs = res;
      if (res.fipList) {
        this.FIs = res['fipList']; //In Divami Environment
      } else {
        this.FIs = res;
      }
      this.searchedFIs = this.FIs;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }


  putICICIAtTop() {
    let iciciFI;
    this.FIs.forEach(fi => {
      if (fi.fipID == '8') {
        iciciFI = fi;
      }
    });
    this.FIs = this.FIs.filter(item => {
      return item.fipID != '8'
    })
    this.FIs.unshift(iciciFI);

  }

  hideDialog() {
    this.display = false;
  }

  onSearchChange(value) {
    // this.searchedFIs = this.util.searchElement(this.FIs, value, "fipName");
    this.searchedFIs = this.util.searchElementBasedOnFilter(this.FIs, value, this.selectedFilter.value, 'category', "fipName");
  }

  selectFI(FIData) {
    if (FIData.fipStatus == 'DISABLED') {
      FIData.selected = !FIData.selected;
    }
    FIData.selected = !FIData.selected;
    this.getSelectedFIs();
  }

  getSelectedFIs() {
    this.selectedFIs = this.FIs.filter((FI) => {
      return FI.selected;
    });
    console.log(this.selectedFIs)
    this.linkHelper.setData(this.linkHelper.dataObj.SELECTED_ACCOUNTS, this.selectedFIs)
    if (this.selectedFIs.length) {
      this.linkHelper.markCurrentStepAsDone(true);
    } else {
      this.linkHelper.markCurrentStepAsDone(false);
    }
    this.selectedFi()
  }

  selectedFi() {
    this.selectedFI.emit(this.selectedFIs)
  }

  togglePopup(bool) {
    this.display = bool;
  }

  changeFilterValue(filter, searchField) {
    this.selectedFilter = filter;
    this.searchedFIs = this.util.searchElementBasedOnFilter(this.FIs, searchField.value, this.selectedFilter.value, 'category', "fipName");
  }

  disabledFIP(fi) {
    //     if(!fi.identifiers){
    //         return true;
    //     }else if(this.commonService.enabledFIP.includes(fi.fipID)){
    return false;
    // }else{
    // return true;
    // }
  }

}
