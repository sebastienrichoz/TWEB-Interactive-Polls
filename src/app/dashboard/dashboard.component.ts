import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from "@angular/forms";
import {ToastComponent} from "../shared/toast/toast.component";
import {DashboardService} from "../services/dashboard.service";

import {single, multi} from './data';
import {Router} from "@angular/router";

declare let $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    // forms



    // tabs
    private displayPollsCreated = true;
    private displayPollsJoined = false;

    // bar chart
    single: any[];

    view: any[] = [1100, 500];

    // bar chart options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Poll';
    showYAxisLabel = true;
    yAxisLabel = 'Audience';

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor(private dashboardService: DashboardService,
                private toast: ToastComponent,
                private formBuilder: FormBuilder,
                private router: Router) {
                Object.assign(this, {single, multi} );
    }

    ngOnInit() {


    }

    ngAfterViewInit() {
    }


    clickBar($event) {
        console.log($event);
    }

    openPollsCreated() {
        this.displayPollsCreated = true;
        this.displayPollsJoined = false;
    }

    openPollsJoined() {
        this.displayPollsJoined = true;
        this.displayPollsCreated = false;
    }

}
