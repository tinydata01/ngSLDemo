import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-stepper-nav',
  templateUrl: './stepper-nav.component.html',
  styleUrls: ['./stepper-nav.component.scss']
})
export class StepperNavComponent implements OnInit {

  @Input() stepperData: any;
  currentStep: any;
  display: boolean;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    let currentStep = this.stepperData[0];
    this.currentStep = currentStep;
  }

  getCurrentStep() {
    let currentStep = this.stepperData.find((step) => {
      return step.active;
    });
    return currentStep || {};
  }

  showIt() {
    this.display = true;
  }

}
