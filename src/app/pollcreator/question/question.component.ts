import {
    Component, OnInit, style, animate, transition,
    state, trigger, Input, EventEmitter, Output
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

    @Input() question: Question = new Question(1, '');
    @Output() onDelete = new EventEmitter<Question>();
    @Output() onPublish = new EventEmitter<Question>();
    @Output() onClose = new EventEmitter<Question>();

    private published: boolean = false;
    private closed: boolean = false;

    constructor() {
    }

    ngOnInit() {}

    close() {
        this.closed = true;
        // Inform parent to publish this question
        this.onClose.emit(this.question);
    }

    publish() {
        this.published = true;
        // Inform parent to publish this question
        this.onPublish.emit(this.question);
    }

    deleteQuestion() {
        // Inform parent to remove this question from its list
        this.onDelete.emit(this.question);
    }

    addAnswer() {
        let size = this.question.answers.length;
        this.question.addAnswer(new Answer(size+1, ''));
    }

    removeAnswer(answer: Answer) {
        this.question.removeAnswer(answer);
    }

}
