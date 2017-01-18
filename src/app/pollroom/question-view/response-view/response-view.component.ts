import {Component, OnInit, Output, Input, OnChanges} from '@angular/core';
import {Question} from "../../../models/question";

@Component({
    moduleId: module.id,
    selector: 'response-view',
    templateUrl: 'response-view.component.html',
    styleUrls: ['response-view.component.css']
})
export class ResponseViewComponent implements OnInit, OnChanges {

    @Input() question: Question;
    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
    }
}
