import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormDefinationService } from '../../../../services/form-defination.service';
import { HttpService } from '../../../../services/http.service';
import { LoaderService } from '../../../../services/loader.service';
import { LinkingStepperHelperService } from '../../services/linking-stepper-helper.service';
import { CommonService } from '../../../../services/common.service';
import { UserService } from '../../../../services/user.service';
import { toastStatuses } from '../../../../components/toast/toast.component';
import { Validators } from '@angular/forms';
import { formStatuses } from '../../../../constants/account-linking.constant';
import { MyLibService as OnemoneyWebsdkService } from '../../../../../lib/my-lib.service';

@Component({
  selector: 'app-discover-account',
  templateUrl: './discover-account.component.html',
  styleUrls: ['./discover-account.component.scss']
})
export class DiscoverAccountComponent implements OnInit {
  rawData: any;
  serverError: any;
  allAccountsLinked: boolean = false;

  @Output() accountDiscoverySkipped: EventEmitter<any> = new EventEmitter();

  constructor(
    private oneMoneyService:OnemoneyWebsdkService
  ) { }

  eachfi
  userNumber: any;
  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 30
  };

  discoverDone = false;
  enteredOtp: any;
  otpRefNumber: any;
  discoveredAccounts: any = [];
  discoveredAcc: any = {};
  formStatuses = formStatuses;


  ngOnInit() {
  }

 
  compareLinkedAccounts(data) {
    let unlinked = data.DiscoveredAccounts.filter((acc) => {
      let ac = this.rawData.linkedAccounts.find((dAcc) => dAcc.accountRefNumber == acc.accRefNumber);
      return ac ? false : true;
    })
    if ((data.DiscoveredAccounts.length != unlinked.length) && unlinked.length == 0) {
      this.allAccountsLinked = true;
    }
    return unlinked;
  }

  


  /**
   *
   * @param e
   */
  onInputChange(e) {
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      this.enteredOtp = e;
    }
  }
  discoverAccount(){
    this.oneMoneyService.getDiscoveredAccountList().subscribe(response=>{
      
    })
  }

}
