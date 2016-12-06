import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from "@angular/forms";;
import {ToastComponent} from "../shared/toast/toast.component";
import {DashboardService} from "../services/dashboard.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private newPollForm: FormGroup;
    private pollName = new FormControl("", Validators.required);

    private joinPollForm: FormGroup;
    private pollRoomNumber = new FormControl("", Validators.required);

    constructor(private dashboardService: DashboardService,
                private toast: ToastComponent,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.newPollForm = this.formBuilder.group({
            pollName: this.pollName
        });

        this.joinPollForm = this.formBuilder.group({
            pollRoomNumber: this.pollRoomNumber
        });
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

}
