import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../../services/dashboard.service";

@Component({
    selector: 'global-stats',
    templateUrl: './global-stats.component.html',
    styleUrls: ['./global-stats.component.css']
})
export class GlobalStatsComponent implements OnInit {

    private nbPollCreated = 18;
    private nbQuestionAsked = 149;
    private nbPollJoined = 73;
    private nbAnswerGiven = 1562;

    private isLoading: boolean;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        // TODO
        // this.getGlobalStats();
    }

    getGlobalStats() {
        this.dashboardService.getGlobalStats().subscribe(
            data => {
                this.nbPollCreated = data.nbPollCreated;
                this.nbQuestionAsked = data.nbQuestionAsked;
                this.nbPollJoined = data.nbPollJoined;
                this.nbAnswerGiven = data.nbAnswerGiven;
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

}
