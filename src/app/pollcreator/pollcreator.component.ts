import {
    Component, OnInit, style, animate, transition,
    state, trigger
} from '@angular/core';
import {single, multi} from './data';

import {PollElement} from "./PollElement";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {ToastComponent} from "../shared/toast/toast.component";
import {PollcreatorService} from "./pollcreator.service";

@Component({
    selector: 'pollcreator',
    templateUrl: './pollcreator.component.html',
    styleUrls: ['./pollcreator.component.css'],
    animations: [
        trigger('flyInOut', [
            state('in', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.2s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class PollcreatorComponent implements OnInit {

    // forms
    private createPollForm: FormGroup;
    private pollName = new FormControl("", Validators.required);

    // pie chart options
    single: any[];
    view: any[] = [550, 200];
    // options
    gradient = false;
    showLegend = false;
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    // pie
    showLabels = false;
    explodeSlices = false;
    doughnut = false;

    pollElements: PollElement[] = [];

    constructor(private pollcreatorService: PollcreatorService,
                private toast: ToastComponent,
                private formBuilder: FormBuilder) {
        this.pollElements.fill(new PollElement(), 0, 1);
        Object.assign(this, {single, multi});
    }

    ngOnInit() {
        this.createPollForm = this.formBuilder.group({
            pollName: this.pollName
        });
    }

    addPollElement() {
        this.pollElements.push(new PollElement());
    }

    removePollElement(element: PollElement) {
        let index = this.pollElements.indexOf(element, 0);
        if (index > -1)
            this.pollElements.splice(index, 1);
    }

    clickPieChart($event) {
        console.log($event);
    }

    createPoll() {
        console.log("Creating poll " + this.pollName.value);
    }
}
