import { Component, OnInit, forwardRef, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms'


@Component({
  selector: 'app-custom-otp',
  templateUrl: './custom-otp.component.html',
  styleUrls: ['./custom-otp.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomOtpComponent),
      multi: true
    }
  ]
})
export class CustomOtpComponent implements OnInit, OnChanges, AfterViewInit {

  defaultLength = 6;
  values = [];
  demoValues = [];

  /**
   * Default value of the fields
   */
  @Input('value') _value = null;
  onChange: any = () => { };
  onTouched: any = () => { };
  reset: boolean = false;
  @Input() isPassword: boolean = false;

  /**
   * Settings (Can add more fields in future)
   * - length: length of the input fields
   */
  // @Input('settings') set settings(value) {
  //   if (value && value.length) {
  //     this.defaultLength = value.length;
  //     this.reset = value.reset;
  //   }
  // }
  @Input('settings') settings;
  /**
   * Event triggered on input value 
   */
  @Output() inputChange = new EventEmitter();

  constructor() {
    // initialising the values to "" based on the length
    this.forgotPinDemoValues();
  }

  ngOnInit() { }
  ngAfterViewInit() {
    if (this.settings && this.settings.length) {
      this.defaultLength = this.settings.length;

    }
  }
  forgotPinDemoValues() {
    this.values = [];
    this.demoValues = []
    for (let index = 0; index < this.defaultLength; index++) {
      this.values.push("");
      this.demoValues.push("");
    }
  }

  //Folowing are the methods used by the Angular
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    console.log("value in write", value)
    if (value) {
      this.values = [];
      for (let index = 0; index < this.defaultLength; index++) {
        this.values.push(value[index]);
        this.demoValues.push(String.fromCharCode(8226));
      }
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // Following are the methods used by us

  /**
   * To emit the value to the parent on entering
   * @param value value of the input fields
   */
  tellParent(value) {
    this.value = value;
    this.settings.reset=false;
    this.inputChange.emit(this.value);
  }

  /**
   * To change the data in the input field on value change
   * @param event event object
   * @param index index of the input filed
   */
  changed(event, index) {
    if (event.target.value && event.target.value.length) {
      // if(this.isPassword){
      //     event.target.type = 'password';
      // }
      this.demoValues[index] = String.fromCharCode(8226);
      this.values[index] = event.target.value;
      event.preventDefault();
      this.keytab(event);
    }
    if (event.target.value == "") {
      this.values[index] = "";
      this.demoValues[index] = '';
    }

    let value = "";

    for (let index = 0; index < this.values.length; index++) {
      value += this.values[index];
    }

    this.tellParent(value);
  }

  /**
   * To handle the tab event on input change
   * @param event event object
   */
  keytab(event) {
    let element = event.srcElement.nextElementSibling; // get the sibling element

    if (element == null) {
      return;
    }  // check if its null
    else
      element.select();
    element.focus();   // focus if not null
  }

  /**
   * To handle the backspace
   * Triggers when key is pressed
   * @param event event object
   * 
   */
  keyuped(event) {
    if (event.keyCode == 8 && !event.target.value) {
      let element = event.srcElement.previousElementSibling; // get the sibling element

      if (element == null)  // check if its null
        return;
      else
        element.focus();   // focus if not null
    }
  }

  //Triggers when keypress is done i.e at the end
  keyUp(event) {
  }

  /**
   * To handle the ngFor randomness using trackBy
   * @param index index of the input field
   * @param value value of the input field
   */
  indexTracker(index: number, value: any) {
    return index;
  }

  ngOnChanges() {

    this.forgotPinDemoValues();
    
  }
  ngDoCheck() {
    if (this.settings.reset == true) {
      this.forgotPinDemoValues();
    }
  }
}
