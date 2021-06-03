import { Component, EventEmitter, OnInit, Output,Input } from '@angular/core';

@Component({
  selector: 'app-custom-overlay',
  templateUrl: './custom-overlay.component.html',
  styleUrls: ['./custom-overlay.component.scss']
})
export class CustomOverlayComponent {
  // @Input() showVerifyOTP:boolean;
  @Output() readonly closeOverlay = new EventEmitter<boolean>();
  constructor() { }

  closeOverlayClicked(): void {
    this.closeOverlay.emit(true);
  }

}
