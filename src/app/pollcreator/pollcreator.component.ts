import {
    Component, OnInit, style, animate, transition,
    state, trigger
} from '@angular/core';
import {single, multi} from './data';

import {PollElement} from "./PollElement";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {ToastComponent} from "../shared/toast/toast.component";
import {PollcreatorService} from "./pollcreator.service";
import {Question} from "./question/question";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    gradient = false;
    showLegend = false;
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    showLabels = false;
    explodeSlices = false;
    doughnut = false;

    // A poll element contains a question, buttons, and a pie chart
    pollElements: PollElement[] = [];

    question: Question;

    constructor(private pollcreatorService: PollcreatorService,
                private toast: ToastComponent,
                private formBuilder: FormBuilder,
                public toastr: ToastsManager) {
        this.pollElements.push(new PollElement());
        Object.assign(this, {single, multi});
    }

    onPublish(question: Question) {
        // TODO : Publish this question (socket.io + mongoDB)
        this.toastr.success(question.label, 'Question published!');
    }

    onDelete(question: Question) {
        // TODO : Remove question from mongoDB

        // Find question and remove it
        let element: PollElement;
        element = this.pollElements.find(el => el.question === question);
        this.removePollElement(element);
    }

    onClose(question: Question) {
        this.toastr.success(question.label, 'Question closed!');
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

    saveChanges() {
        console.log("Saved");
        let date: Date = new Date();
        this.toastr.success(date.toLocaleDateString() + " at " + date.toLocaleTimeString(), 'Changes saved!');
    }

    publish(element: PollElement) {
        console.log("Published question: " + element.question.label);
        console.log(element);
        this.toast.setMessage("Published question: " + element.question.label, "success");
    }
}
