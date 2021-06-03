import { Component, OnInit, Input } from "@angular/core";
import { identifierValues } from '../../constants/account-linking.constant';
import { DataService } from '../../services/data.service';
import { MyLibService as OnemoneyWebsdkService } from '../../../lib/my-lib.service';

@Component({
  selector: "app-fi-small-card",
  templateUrl: "./fi-small-card.component.html",
  styleUrls: ["./fi-small-card.component.scss"]
})
export class FiSmallCardComponent implements OnInit {
  massagedCardData: any;
  @Input() isConsentDetails: boolean = false;
  @Input() set cardData(value: any) {
    this.massagedCardData = this.massageData(value);
  }
  @Input() needReqData: boolean = false;
  FIPs ;

  tempCardData = {
    fipID: "2",
    fipName: "IDFC First Bank",
    url: "https://fip.onemoney.in",
    host: "fip.onemoney.in",
    logoUrl: "http://sandboxaa.onemoney.in/assets/logos/idfc.png",
    smallUrl: "http://sandboxaa.onemoney.in/assets/small_logos/IDFC_icon.png",
    identifiers: [
      {
        identifier: "MOBILE",
        identifierSize: 10,
        identifierType: "STRONG",
        identifierDataTypes: "Number",
        identifierSample: ""
      }
    ],
    discoverOTP: false,
    FIs: ["DEPOSIT"]
  };

  constructor(private dataService : DataService, private oneMoneyService: OnemoneyWebsdkService) {}

  ngOnInit() {
    // this.oneMoneyService.getFipList().subscribe(res => {
    //     let FIPList  =localStorage.getItem('fips');
    //     if(!FIPList){
    //         localStorage.setItem('fips',res)
    //     }
    //     this.FIPs = res; 
    //     (typeof this.FIPs.fipList == "undefined" ? this.FIPs : this.FIPs.fipList).forEach(element => {
    //         if(this.massagedCardData.fipID == element.fipID){
    //             this.massagedCardData = {
    //                 ...this.massagedCardData,
    //                 ...element
    //             }
    //         }
    //     });
    // })
  }

  massageData(data) {
    if (this.isConsentDetails) {
      return { ...data };
    } else {
      let joinedFIs = data.FIs && data.FIs.join(",");
      let requireIds =
        data.identifiers &&
        data.identifiers.map(id => {
            // id.identifier
            if(identifierValues[id.identifier]){
                return identifierValues[id.identifier]
            }else{
                return id.identifier
            }
        }).join(",");
      return {
        ...data,
        joinedFIs,
        requireIds
      };
    }
  }

//   checkMultipleIdentifier(identifierString){
//       let identifiers = identifierString.split(',');
//       if(identifiers.length > 1){
//           return true;
//       }
//       return false;
//   }
}
