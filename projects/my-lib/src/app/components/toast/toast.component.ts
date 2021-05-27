import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
errorImage:any
successfullImage:any
  toastData = {
    visibility: false,
    status:"",
    data:""
  };

  topOfToast;
  
  
  constructor(private loader: LoaderService) { }

  ngOnInit() {
    this.errorImage = '../../../assets/images/svgs/error.svg'
    this.successfullImage = '../../../assets/images/svgs/successful.svg'
    this.loader.getToastVisibility().subscribe((data: any = { visibility: false }) => {
      this.toastData = data;
      if(data.visibility){
          let header = document.querySelector('.header--section');
          if(header && !data.top){
              this.topOfToast = this.returnBottomOfHeader(header);
              if(this.topOfToast <= 0){
                  this.topOfToast = 0
              }else{
                  this.topOfToast = this.topOfToast + 'px';
              }
          }else{
              this.topOfToast = 0;
          }
      }
    });
  }

  returnBottomOfHeader(element){
    return element.getBoundingClientRect().bottom;
  }

}

export const toastStatuses = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning"
};

export const toastMessages = {
    NO_INTERNET : 'somethingWentWrong',
    UNREGISTERED_NUMBER : "enterRegisteredMobileNumber",
    INVALID_SESSION : "invalidUserSession",
}