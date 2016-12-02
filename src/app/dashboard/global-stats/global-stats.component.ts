import { Component, OnInit } from '@angular/core';

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

    constructor() { }

    ngOnInit() {
    }

}
