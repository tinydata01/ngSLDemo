import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-aahandle',
  templateUrl: './aahandle.component.html',
  styleUrls: ['./aahandle.component.scss']
})
export class AahandleComponent implements OnInit {
  aahandle:any;
  constructor(private router: Router ) { }

  ngOnInit(): void {
  }
  openSignupForm(aahandle){
  localStorage.setItem("aaHandle",aahandle);
  this.router.navigate(['/signup']);
  }
}
