import {
    Component, OnInit, style, animate, transition,
    state, trigger
} from '@angular/core';

import {PollElement} from "./PollElement";

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

    pollElements: PollElement[] = new Array(1);

    constructor() { }

    ngOnInit() {
        this.pollElements.fill(new PollElement(), 0, 1);
    }

    addPollElement() {
        this.pollElements.push(new PollElement());
    }

    removePollElement(element: PollElement) {
        let index = this.pollElements.indexOf(element, 0);
        if (index > -1)
            this.pollElements.splice(index, 1);
    }

}
