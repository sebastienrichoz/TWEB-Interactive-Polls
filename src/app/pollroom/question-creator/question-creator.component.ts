import {
    Component, OnInit, style, animate, transition,
    state, trigger, Input, EventEmitter, Output
} from '@angular/core';

import { Question, Answer } from '../../models/question';
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'question-creator',
    templateUrl: 'question-creator.component.html',
    styleUrls: ['question-creator.component.css'],
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
        ]),
        trigger('comeInOut', [
            state('in', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(0) scale(0)'
                }),
                animate(200)
            ])
        ])
    ]
})
export class QuestionCreatorComponent implements OnInit {

    question: Question;
    @Output() onPublish = new EventEmitter<Question>();

    private published: boolean = false;
    private isFocus = false;

    private MIN_ANSWER = 2;
    private MAX_ANSWER = 10;

    constructor(public toastr: ToastsManager) {
    }

    ngOnInit() {
        this.initQuestion();
    }

    // Publish the created question
    publish() {
        let errorMessage: string;

        let answers: Array<string> = [];
        for (let answer of this.question.answers)
            if (answer.label && answer.label.trim())
                answers.push(answer.label.trim());

        if (answers.length < 2)
            errorMessage = "Min. 2 answers required";

        if (!(this.question.label && this.question.label.trim()))
            errorMessage = "No title for your question";

        if (errorMessage) {
            this.toastr.error(errorMessage);
        } else {
            // publish this question

            // (parent is listening on new questions with socket)

            this.toastr.success("Question published");

            this.hideFullQuestion();
            this.initQuestion();
        }
    }

    addAnswer() {
        let size = this.question.answers.length;

        if (size < this.MAX_ANSWER)
            this.question.addAnswer(new Answer(size+1, ''));
        else
            this.toastr.error("Max. " + this.MAX_ANSWER + " answers");
    }

    removeAnswer(answer: Answer) {
        if (this.question.answers.length > 2)
            this.question.removeAnswer(answer);
        else
            this.toastr.error("Min. " + this.MIN_ANSWER + " answers");
    }

    displayFullQuestion() {
        this.isFocus = true;
    }

    hideFullQuestion() {
        this.isFocus = false;
    }

    displayOrHideFullQuestion() {
        this.isFocus = !this.isFocus;
    }

    initQuestion() {
        this.question = new Question(-1, '');
        this.question.addAnswer(new Answer(-1, ''));
        this.question.addAnswer(new Answer(-1, ''));
    }
}
