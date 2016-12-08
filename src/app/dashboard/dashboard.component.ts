import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from "@angular/forms";;
import {ToastComponent} from "../shared/toast/toast.component";
import {DashboardService} from "../services/dashboard.service";

import {single, multi} from './data';

declare let $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    // forms
    private newPollForm: FormGroup;
    private pollName = new FormControl("", Validators.required);

    private joinPollForm: FormGroup;
    private pollRoomNumber = new FormControl("", Validators.required);

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
                private formBuilder: FormBuilder) {
                Object.assign(this, {single, multi} );
    }

    ngOnInit() {
        this.newPollForm = this.formBuilder.group({
            pollName: this.pollName
        });

        this.joinPollForm = this.formBuilder.group({
            pollRoomNumber: this.pollRoomNumber
        });
    }

    ngAfterViewInit() {
    }

    createPoll() {
        console.log("Create poll " + this.pollName.value);

        if (this.pollName.value.length < 2) {
            this.toast.setMessage("Poll name must be at least 2 caracters long", "danger");
        } else {
            this.dashboardService.addPoll(this.pollName.value).subscribe(
                res => {
                    this.toast.setMessage("Poll successfully created!", "success");
                    // TODO : redirect to Poll Creator with pollname value
                },
                error => this.toast.setMessage(error, "danger")
            );
        }
    }

    joinPoll() {
        console.log("Join poll room " + this.pollRoomNumber.value);

        this.dashboardService.joinPoll(this.pollRoomNumber.value).subscribe(
            res => {
                this.toast.setMessage("Poll room " + this.pollRoomNumber.value + " successfully joined!", "success");
                // TODO : redirect to Poll Room with appropriate pollroom number
            },
            error => this.toast.setMessage(error, "danger")
        )
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
