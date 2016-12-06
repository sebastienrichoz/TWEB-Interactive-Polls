import {
    Component, OnInit, style, animate, transition,
    state, trigger
} from '@angular/core';

import { Question, Answer } from './question';

@Component({
    selector: 'question-creator',
    templateUrl: 'question.component.html',
    styleUrls: ['question.component.css'],
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
export class QuestionComponent implements OnInit {

    question: Question = new Question();

    constructor() {
    }

    ngOnInit() {

    }

    addAnswer() {
        this.question.addAnswer(new Answer());
    }

    removeAnswer(answer: Answer) {
        this.question.removeAnswer(answer);
    }

}
