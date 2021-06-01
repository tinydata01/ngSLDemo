import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent implements OnInit {

    showFilterMenu: boolean = false;
    selectedFilter: any;

    constructor() { }

    /*
        Usage:-
        <app-filter-dropdown [filterData]="filterData" [defaultFilterIndex]="2"  (valueUpdated)="changeFilterValue($event)"></app-filter-dropdown>
    */

    //Input in the form of array of objects having format
    // {
    //   "name" : "Some name"
    //   "value" : "corresponding value"
    // }
    //
    @Input() filterData : any ;

    //This input is for giving selecting something at initialisation
    @Input() defaultFilterIndex? : any ;

    //This emits the filter object when it is selected
    @Output() valueUpdated = new EventEmitter;

    ngOnInit() {
        if(this.defaultFilterIndex <= this.filterData.length){
            this.selectedFilter = this.filterData.filters[this.defaultFilterIndex]
        } else {
            this.selectedFilter = this.filterData.filters[0]
        }
    }

    openFilterMenu(){
        this.showFilterMenu = true;
    }

    closeFilterMenu(){
        this.showFilterMenu = false;
    }

    changeFilterValue(filterIndex){
        this.selectedFilter = this.filterData.filters[filterIndex]
        this.valueUpdated.emit(this.selectedFilter);
    }

}
