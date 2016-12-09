import { Component, OnInit } from '@angular/core';
import {Question, Answer} from "../pollcreator/question/question";
import {single, multi} from "../pollcreator/data";

@Component({
    selector: 'app-pollroom',
    templateUrl: './pollroom.component.html',
    styleUrls: ['./pollroom.component.css']
})
export class PollroomComponent implements OnInit {

    private questions: Question[] = [];
    private nbAnswers: number;
    private nbTotalAnswers: number;
    private questionsChecked: Map<number, number> = new Map();

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

    constructor() {
        Object.assign(this, {single, multi});

        let r11 = new Answer(1, 'A framework');
        let r12 = new Answer(2, 'A node package');
        let r13 = new Answer(3, 'A language');
        let q1 = new Question(1, "What's Angular2 ?", r11, r12, r13);

        let r21 = new Answer(4, 'Amazing!');
        let r22 = new Answer(5, 'Hard to learn');
        let r24 = new Answer(7, 'Never tried that');
        let q2 = new Question(2, "How is Angular2 for you ?", r21, r22, r24);

        let r31 = new Answer(8, 'Angular1');
        let r32 = new Answer(9, 'Angular2');
        let r33 = new Answer(10, 'None of them !');
        let q3 = new Question(3, "Do you prefer Angular1 or Angular2 ?", r31, r32, r33);

        this.questions.push(q1);
        this.questions.push(q2);
        this.questions.push(q3);

        this.nbAnswers = 0;
        this.nbTotalAnswers = this.questions.length;
    }

    ngOnInit() {
    }

    answerGiven(question: Question, answer: Answer) {
        // TODO : socket.io
        console.log(question.label + " " + answer.label);
    }

    onChecked(e, questionId, answerId) {
        console.log("id: " + questionId + " " + answerId);
        let nbAnswers = this.questionsChecked.get(questionId);
        if(e.target.checked) {
            if (nbAnswers === undefined || nbAnswers === 0) {
                this.nbAnswers++;
                this.questionsChecked.set(questionId, 1);
            } else {
                this.questionsChecked.set(questionId, nbAnswers + 1);
            }
        } else {
            if (nbAnswers === 1) {
                this.questionsChecked.set(questionId, 0);
                this.nbAnswers--;
            } else {
                this.questionsChecked.set(questionId, nbAnswers - 1);
            }
        }
    }

    clickPieChart($event) {
        console.log($event);
    }

}
