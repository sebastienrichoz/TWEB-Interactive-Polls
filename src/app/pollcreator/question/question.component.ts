import { Component, OnInit } from '@angular/core';

import { Question, Answer } from './question';

@Component({
    selector: 'question-creator',
    templateUrl: 'question.component.html',
    styleUrls: ['question.component.css']
})
export class QuestionComponent implements OnInit {

    question: Question;

    constructor() { }

    ngOnInit() {
        this.question = new Question();
    }

    addAnswer() {
        this.question.addAnswer(new Answer());
    }

    removeAnswer(answer: Answer) {
        this.question.removeAnswer(answer);
    }

}
