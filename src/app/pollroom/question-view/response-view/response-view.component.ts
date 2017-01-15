import {Component, OnInit, Output, Input} from '@angular/core';
import {Question} from "../../../models/question";

@Component({
    selector: 'response-view',
    templateUrl: 'response-view.component.html',
    styleUrls: ['response-view.component.css']
})
export class ResponseViewComponent implements OnInit {

    @Input() question: Question;
    constructor() { }

    ngOnInit() {
    }
}
